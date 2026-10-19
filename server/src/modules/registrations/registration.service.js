import PDFDocument from 'pdfkit';
import { ConferenceRegistration, PaymentSubmission, RegistrationApprovalHistory, Notification } from './registration.model.js';
import { SystemSetting } from '../settings/setting.model.js';
import { logAuditEvent } from '../audit/audit.service.js';
import { AppError } from '../../utils/appError.js';
import { signHmac } from '../../utils/cryptoHelper.js';
import { sendEmail } from '../../config/mailer.js';
import { logger } from '../../utils/logger.js';

// Default bank details as specified in project requirements
const DEFAULT_BANK_DETAILS = {
  accountTitle: 'AL-KHAWARIZMI INSTITUTE OF COMPUTER SCIENCE UET LAHORE',
  iban: 'PK93UNIL0109000316984445',
  bankName: 'UNITED BANK LIMITED',
  swiftCode: 'UNILPKKA',
  branch: 'UBL UET BRANCH',
  branchCode: '1950',
  branchAddress: 'MAIN GT ROAD UET LAHORE',
  instructions: 'Please transfer the exact total payable amount to the official ICOSST account and upload the transaction receipt/screenshot for finance verification.',
};

// Default registration fees
const DEFAULT_FEE_SETTINGS = {
  currency: 'PKR',
  ieeeStudentPhysical: 1000,
  ieeeStudentVirtual: 1000,
  nonIeeeProfessionalPhysical: 2000,
  nonIeeeProfessionalVirtual: 2000,
  dinnerFee: 5000,
};

export async function getBankDetails() {
  const setting = await SystemSetting.findOne({ key: 'BANK_TRANSFER_DETAILS' });
  return setting?.value || DEFAULT_BANK_DETAILS;
}

export async function getFeeSettings() {
  const setting = await SystemSetting.findOne({ key: 'REGISTRATION_FEE_SETTINGS' });
  return setting?.value || DEFAULT_FEE_SETTINGS;
}

export async function calculateRegistrationFee({ participantCategory, attendanceMode = 'PHYSICAL', attendDinner = false }) {
  const feeConfig = await getFeeSettings();

  let registrationFee = 0;
  if (participantCategory === 'IEEE_MEMBER_STUDENT') {
    registrationFee = attendanceMode === 'VIRTUAL' ? feeConfig.ieeeStudentVirtual : feeConfig.ieeeStudentPhysical;
  } else {
    registrationFee = attendanceMode === 'VIRTUAL' ? feeConfig.nonIeeeProfessionalVirtual : feeConfig.nonIeeeProfessionalPhysical;
  }

  const dinnerFee = attendDinner ? feeConfig.dinnerFee : 0;
  const totalFee = registrationFee + dinnerFee;

  return {
    registrationFee,
    dinnerFee,
    totalFee,
    currency: feeConfig.currency || 'PKR',
  };
}

// Generate unique sequential-style registration number
async function generateRegistrationNumber() {
  const count = await ConferenceRegistration.countDocuments();
  const nextNum = (count + 1001).toString().padStart(4, '0');
  return `ICOSST26-REG-${nextNum}`;
}

export async function getMyRegistration(userId) {
  const registration = await ConferenceRegistration.findOne({ userId })
    .populate('approvedBy', 'name email')
    .lean();

  if (!registration) {
    return null;
  }

  const paymentSubmission = await PaymentSubmission.findOne({ registrationId: registration._id })
    .populate('verifiedBy', 'name email')
    .lean();

  const approvalHistory = await RegistrationApprovalHistory.find({ registrationId: registration._id })
    .sort({ createdAt: -1 })
    .populate('changedBy', 'name email role')
    .lean();

  return {
    ...registration,
    paymentSubmission,
    approvalHistory,
  };
}

export async function createOrUpdateRegistration(userId, registrationData, req = null) {
  const {
    fullName,
    email,
    phone,
    organization,
    isIeeeMember,
    ieeeMembershipNumber,
    participantCategory,
    attendanceMode,
    selectedActivities,
    attendDinner,
  } = registrationData;

  // Server-side authoritative fee calculation
  const { registrationFee, dinnerFee, totalFee, currency } = await calculateRegistrationFee({
    participantCategory,
    attendanceMode,
    attendDinner,
  });

  let existing = await ConferenceRegistration.findOne({ userId });

  if (existing) {
    throw AppError.badRequest(
      `You already have registration ${existing.registrationNumber}. Each student may submit only one conference registration.`
    );
  }

  // Create new registration
  const regNumber = await generateRegistrationNumber();
  const newRegistration = await ConferenceRegistration.create({
    registrationNumber: regNumber,
    userId,
    fullName,
    email,
    phone,
    organization,
    isIeeeMember,
    ieeeMembershipNumber: isIeeeMember ? (ieeeMembershipNumber || '') : '',
    participantCategory,
    attendanceMode,
    selectedActivities,
    attendDinner,
    registrationFee,
    dinnerFee,
    totalFee,
    currency,
    registrationStatus: 'PENDING_PAYMENT',
    paymentStatus: 'NOT_SUBMITTED',
  });

  // Record approval history entry
  await RegistrationApprovalHistory.create({
    registrationId: newRegistration._id,
    newRegistrationStatus: 'PENDING_PAYMENT',
    newPaymentStatus: 'NOT_SUBMITTED',
    changedBy: userId,
    actorRole: 'participant',
    action: 'REGISTRATION_SUBMITTED',
    reason: 'Initial conference registration submitted by participant',
  });

  // Notification for participant
  await Notification.create({
    recipientId: userId,
    recipientRole: 'participant',
    title: 'Registration Submitted',
    message: `Your registration (${regNumber}) has been submitted. Total payable amount is ${currency} ${totalFee.toLocaleString()}. Please complete payment submission to verify your registration.`,
    type: 'REGISTRATION',
    link: '/dashboard/payment',
  });

  // Email confirmation
  try {
    await sendEmail({
      to: email,
      subject: `ICOSST 2026 — Registration Received (${regNumber})`,
      html: `
        <h2>Conference Registration Received</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for registering for the <strong>20th IEEE International Conference on Open Source Systems & Technologies (ICOSST 2026)</strong>.</p>
        <p><strong>Registration Number:</strong> ${regNumber}</p>
        <p><strong>Category:</strong> ${participantCategory === 'IEEE_MEMBER_STUDENT' ? 'IEEE Member / Student' : 'Non-IEEE Member / Professional'}</p>
        <p><strong>Attendance Mode:</strong> ${attendanceMode}</p>
        <p><strong>Total Payable:</strong> ${currency} ${totalFee.toLocaleString()}</p>
        <p>Please log in to your participant dashboard and upload your bank transfer payment proof to initiate verification.</p>
        <br/>
        <p>Warm regards,<br/><strong>ICOSST 2026 Secretariat</strong><br/>KICS, UET Lahore</p>
      `,
    });
  } catch (err) {
    logger.warn({ error: err.message }, 'Failed to send registration confirmation email');
  }

  await logAuditEvent({
    actor: req?.user,
    action: 'REGISTRATION_SUBMITTED',
    targetEntity: 'ConferenceRegistration',
    targetId: newRegistration._id,
    toState: 'PENDING_PAYMENT',
    reason: 'Participant submitted conference registration',
    req,
  });

  return newRegistration;
}

export async function submitPaymentEvidence(userId, paymentData, file, req = null) {
  if (!file) {
    throw AppError.badRequest('Payment receipt file (PDF, JPG, PNG) is required.');
  }

  const registration = await ConferenceRegistration.findOne({ userId });
  if (!registration) {
    throw AppError.notFound('No active conference registration found. Please register first.');
  }

  if (registration.registrationStatus === 'APPROVED' && registration.paymentStatus === 'VERIFIED') {
    throw AppError.badRequest('Payment has already been verified and registration approved.');
  }

  const { transactionReference, paymentDate, amountPaid } = paymentData;

  const receiptUrl = `/uploads/${file.filename}`;
  const receiptFile = {
    url: receiptUrl,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size,
  };

  let paymentSubmission = await PaymentSubmission.findOne({ registrationId: registration._id });

  if (paymentSubmission) {
    // Preserve previous attempt in history
    paymentSubmission.attempts.push({
      attemptNumber: paymentSubmission.attempts.length + 1,
      transactionReference: paymentSubmission.transactionReference,
      paymentDate: paymentSubmission.paymentDate,
      amountPaid: paymentSubmission.amountPaid,
      receiptFile: paymentSubmission.receiptFile,
      submittedAt: paymentSubmission.updatedAt || new Date(),
      verificationStatus: paymentSubmission.verificationStatus,
      adminNotes: paymentSubmission.adminNotes,
      rejectionReason: paymentSubmission.rejectionReason,
      reviewedBy: paymentSubmission.verifiedBy,
      reviewedAt: paymentSubmission.verifiedAt,
    });

    paymentSubmission.transactionReference = transactionReference;
    paymentSubmission.paymentDate = new Date(paymentDate);
    paymentSubmission.amountPaid = amountPaid;
    paymentSubmission.receiptFile = receiptFile;
    paymentSubmission.verificationStatus = 'PENDING_VERIFICATION';
    paymentSubmission.adminNotes = '';
    paymentSubmission.rejectionReason = '';
    await paymentSubmission.save();
  } else {
    paymentSubmission = await PaymentSubmission.create({
      registrationId: registration._id,
      userId,
      paymentMethod: 'BANK_TRANSFER',
      transactionReference,
      paymentDate: new Date(paymentDate),
      amountPaid,
      currency: registration.currency,
      receiptFile,
      verificationStatus: 'PENDING_VERIFICATION',
      attempts: [],
    });
  }

  // Update registration statuses
  const prevRegStatus = registration.registrationStatus;
  const prevPayStatus = registration.paymentStatus;
  registration.paymentStatus = 'PENDING_VERIFICATION';
  registration.registrationStatus = 'PAYMENT_SUBMITTED';
  registration.adminRemarks = '';
  registration.rejectionReason = '';
  await registration.save();

  // Audit and history
  await RegistrationApprovalHistory.create({
    registrationId: registration._id,
    paymentSubmissionId: paymentSubmission._id,
    previousRegistrationStatus: prevRegStatus,
    newRegistrationStatus: 'PAYMENT_SUBMITTED',
    previousPaymentStatus: prevPayStatus,
    newPaymentStatus: 'PENDING_VERIFICATION',
    changedBy: userId,
    actorRole: 'participant',
    action: 'PAYMENT_SUBMITTED',
    reason: `Participant uploaded payment receipt with reference: ${transactionReference}`,
    metadata: { amountPaid, transactionReference },
  });

  // Admin Notification
  await Notification.create({
    recipientId: null, // broadcast to admins
    recipientRole: 'admin',
    title: 'New Payment Verification Request',
    message: `${registration.fullName} has submitted bank payment of ${registration.currency} ${amountPaid.toLocaleString()} (Ref: ${transactionReference}) for registration ${registration.registrationNumber}.`,
    type: 'PAYMENT',
    link: '/admin/finance',
  });

  // Participant Notification
  await Notification.create({
    recipientId: userId,
    recipientRole: 'participant',
    title: 'Payment Submitted for Verification',
    message: `Your payment of ${registration.currency} ${amountPaid.toLocaleString()} (Ref: ${transactionReference}) has been received and queued for admin finance verification.`,
    type: 'PAYMENT',
    link: '/dashboard/status',
  });

  await logAuditEvent({
    actor: req?.user,
    action: 'PAYMENT_SUBMITTED',
    targetEntity: 'PaymentSubmission',
    targetId: paymentSubmission._id,
    toState: 'PENDING_VERIFICATION',
    reason: `Payment receipt submitted for registration ${registration.registrationNumber}`,
    req,
  });

  return { registration, paymentSubmission };
}

export async function adminReviewPayment(registrationId, reviewData, adminUser, req = null) {
  const { action, notes = '', rejectionReason = '' } = reviewData;

  const registration = await ConferenceRegistration.findById(registrationId);
  if (!registration) {
    throw AppError.notFound('Registration not found');
  }

  const paymentSubmission = await PaymentSubmission.findOne({ registrationId });
  if (!paymentSubmission) {
    throw AppError.notFound('No payment submission found for this registration');
  }

  const prevRegStatus = registration.registrationStatus;
  const prevPayStatus = registration.paymentStatus;

  if (action === 'APPROVE') {
    paymentSubmission.verificationStatus = 'VERIFIED';
    paymentSubmission.verifiedBy = adminUser._id;
    paymentSubmission.verifiedAt = new Date();
    paymentSubmission.adminNotes = notes;
    paymentSubmission.rejectionReason = '';
    await paymentSubmission.save();

    registration.paymentStatus = 'VERIFIED';
    registration.registrationStatus = 'UNDER_REVIEW'; // ready for final registration approval
    registration.adminRemarks = notes || 'Payment verified by Finance.';
    await registration.save();

    await RegistrationApprovalHistory.create({
      registrationId: registration._id,
      paymentSubmissionId: paymentSubmission._id,
      previousRegistrationStatus: prevRegStatus,
      newRegistrationStatus: 'UNDER_REVIEW',
      previousPaymentStatus: prevPayStatus,
      newPaymentStatus: 'VERIFIED',
      changedBy: adminUser._id,
      actorRole: adminUser.role,
      action: 'PAYMENT_VERIFIED',
      reason: notes || 'Payment verified and confirmed by finance administrator.',
    });

    await Notification.create({
      recipientId: registration.userId,
      recipientRole: 'participant',
      title: 'Payment Verified',
      message: `Your payment of ${registration.currency} ${paymentSubmission.amountPaid.toLocaleString()} has been verified by the finance committee. Your registration is now under final approval.`,
      type: 'APPROVAL',
      link: '/dashboard/status',
    });

    try {
      await sendEmail({
        to: registration.email,
        subject: `ICOSST 2026 — Payment Verified (${registration.registrationNumber})`,
        html: `
          <h2>Payment Verification Successful</h2>
          <p>Dear <strong>${registration.fullName}</strong>,</p>
          <p>Your payment submission for <strong>ICOSST 2026</strong> has been verified and confirmed by the conference finance committee.</p>
          <p><strong>Registration ID:</strong> ${registration.registrationNumber}</p>
          <p><strong>Amount Verified:</strong> ${registration.currency} ${paymentSubmission.amountPaid.toLocaleString()}</p>
          <p><strong>Transaction Ref:</strong> ${paymentSubmission.transactionReference}</p>
          <p>Your registration is now pending final approval before your digital gate pass and delegate slip are activated.</p>
        `,
      });
    } catch (err) {
      logger.warn({ error: err.message }, 'Failed to send payment verified email');
    }
  } else if (action === 'REJECT') {
    paymentSubmission.verificationStatus = 'REJECTED';
    paymentSubmission.verifiedBy = adminUser._id;
    paymentSubmission.verifiedAt = new Date();
    paymentSubmission.adminNotes = notes;
    paymentSubmission.rejectionReason = rejectionReason;
    await paymentSubmission.save();

    registration.paymentStatus = 'REJECTED';
    registration.registrationStatus = 'PENDING_PAYMENT';
    registration.rejectionReason = rejectionReason;
    registration.adminRemarks = notes || rejectionReason;
    await registration.save();

    await RegistrationApprovalHistory.create({
      registrationId: registration._id,
      paymentSubmissionId: paymentSubmission._id,
      previousRegistrationStatus: prevRegStatus,
      newRegistrationStatus: 'PENDING_PAYMENT',
      previousPaymentStatus: prevPayStatus,
      newPaymentStatus: 'REJECTED',
      changedBy: adminUser._id,
      actorRole: adminUser.role,
      action: 'PAYMENT_REJECTED',
      reason: rejectionReason,
    });

    await Notification.create({
      recipientId: registration.userId,
      recipientRole: 'participant',
      title: 'Payment Verification Rejected',
      message: `Your payment receipt was rejected: "${rejectionReason}". Please review the remarks and resubmit your payment evidence.`,
      type: 'REJECTION',
      link: '/dashboard/payment',
    });

    try {
      await sendEmail({
        to: registration.email,
        subject: `ICOSST 2026 — Payment Verification Required (${registration.registrationNumber})`,
        html: `
          <h2>Payment Verification Update</h2>
          <p>Dear <strong>${registration.fullName}</strong>,</p>
          <p>Your submitted payment receipt for <strong>ICOSST 2026</strong> could not be verified by our finance team.</p>
          <p><strong>Reason:</strong> ${rejectionReason}</p>
          <p>Please log in to your participant portal and resubmit a clear bank deposit slip or transaction receipt with valid reference number.</p>
        `,
      });
    } catch (err) {
      logger.warn({ error: err.message }, 'Failed to send payment rejected email');
    }
  } else if (action === 'REQUEST_RESUBMISSION') {
    paymentSubmission.verificationStatus = 'RESUBMISSION_REQUESTED';
    paymentSubmission.verifiedBy = adminUser._id;
    paymentSubmission.verifiedAt = new Date();
    paymentSubmission.adminNotes = notes;
    paymentSubmission.rejectionReason = rejectionReason;
    await paymentSubmission.save();

    registration.paymentStatus = 'RESUBMISSION_REQUESTED';
    registration.resubmissionNotes = rejectionReason;
    registration.adminRemarks = notes || rejectionReason;
    await registration.save();

    await RegistrationApprovalHistory.create({
      registrationId: registration._id,
      paymentSubmissionId: paymentSubmission._id,
      previousRegistrationStatus: prevRegStatus,
      newRegistrationStatus: prevRegStatus,
      previousPaymentStatus: prevPayStatus,
      newPaymentStatus: 'RESUBMISSION_REQUESTED',
      changedBy: adminUser._id,
      actorRole: adminUser.role,
      action: 'RESUBMISSION_REQUESTED',
      reason: rejectionReason,
    });

    await Notification.create({
      recipientId: registration.userId,
      recipientRole: 'participant',
      title: 'Payment Resubmission Requested',
      message: `The administrator has requested updated payment proof: "${rejectionReason}". Please upload your corrected receipt.`,
      type: 'INFO',
      link: '/dashboard/payment',
    });
  }

  await logAuditEvent({
    actor: adminUser,
    action: `ADMIN_PAYMENT_${action}`,
    targetEntity: 'ConferenceRegistration',
    targetId: registration._id,
    fromState: prevPayStatus,
    toState: registration.paymentStatus,
    reason: notes || rejectionReason,
    req,
  });

  return { registration, paymentSubmission };
}

export async function adminReviewRegistration(registrationId, reviewData, adminUser, req = null) {
  const { action, notes = '', rejectionReason = '' } = reviewData;

  const registration = await ConferenceRegistration.findById(registrationId);
  if (!registration) {
    throw AppError.notFound('Registration not found');
  }

  const prevRegStatus = registration.registrationStatus;

  if (action === 'APPROVE') {
    if (registration.paymentStatus !== 'VERIFIED') {
      throw AppError.badRequest('Cannot approve registration until payment has been verified by finance.');
    }

    const qrPayload = {
      regId: registration._id.toString(),
      regNo: registration.registrationNumber,
      userId: registration.userId.toString(),
      category: registration.participantCategory,
      dinner: registration.attendDinner,
      ts: Date.now(),
    };
    const qrSignature = signHmac(qrPayload);
    const qrToken = `${registration.registrationNumber}.${qrSignature.substring(0, 16)}`;

    registration.registrationStatus = 'APPROVED';
    registration.approvedAt = new Date();
    registration.approvedBy = adminUser._id;
    registration.qrCodeToken = qrToken;
    registration.adminRemarks = notes || 'Registration officially approved by conference committee.';
    await registration.save();

    await RegistrationApprovalHistory.create({
      registrationId: registration._id,
      previousRegistrationStatus: prevRegStatus,
      newRegistrationStatus: 'APPROVED',
      changedBy: adminUser._id,
      actorRole: adminUser.role,
      action: 'REGISTRATION_APPROVED',
      reason: notes || 'Conference registration approved. Delegate credential activated.',
    });

    await Notification.create({
      recipientId: registration.userId,
      recipientRole: 'participant',
      title: 'Registration Approved! Delegate Pass Active',
      message: `Congratulations! Your registration (${registration.registrationNumber}) has been approved. Your official Delegate Pass and QR Clearance are now active.`,
      type: 'APPROVAL',
      link: '/dashboard',
    });

    try {
      await sendEmail({
        to: registration.email,
        subject: `ICOSST 2026 — Registration Officially Approved (${registration.registrationNumber})`,
        html: `
          <h2>Welcome to ICOSST 2026!</h2>
          <p>Dear <strong>${registration.fullName}</strong>,</p>
          <p>We are delighted to confirm that your registration for the <strong>20th IEEE International Conference on Open Source Systems and Technologies (ICOSST 2026)</strong> has been <strong>OFFICIALLY APPROVED</strong>.</p>
          <p><strong>Registration Number:</strong> ${registration.registrationNumber}</p>
          <p><strong>Attendance Mode:</strong> ${registration.attendanceMode}</p>
          <p><strong>Conference Gala Dinner:</strong> ${registration.attendDinner ? 'Confirmed' : 'Not Included'}</p>
          <p>Your Digital Gate Pass and Downloadable Delegate Slip are now ready in your participant portal.</p>
          <p>We look forward to welcoming you at KICS, UET Lahore on 22–23 December 2026.</p>
        `,
      });
    } catch (err) {
      logger.warn({ error: err.message }, 'Failed to send registration approved email');
    }
  } else if (action === 'REJECT') {
    registration.registrationStatus = 'REJECTED';
    registration.rejectionReason = rejectionReason;
    registration.adminRemarks = notes || rejectionReason;
    await registration.save();

    await RegistrationApprovalHistory.create({
      registrationId: registration._id,
      previousRegistrationStatus: prevRegStatus,
      newRegistrationStatus: 'REJECTED',
      changedBy: adminUser._id,
      actorRole: adminUser.role,
      action: 'REGISTRATION_REJECTED',
      reason: rejectionReason,
    });

    await Notification.create({
      recipientId: registration.userId,
      recipientRole: 'participant',
      title: 'Registration Rejected',
      message: `Your registration was rejected: "${rejectionReason}". Please contact conference administration if you believe this is an error.`,
      type: 'REJECTION',
      link: '/dashboard/status',
    });
  }

  await logAuditEvent({
    actor: adminUser,
    action: `ADMIN_REGISTRATION_${action}`,
    targetEntity: 'ConferenceRegistration',
    targetId: registration._id,
    fromState: prevRegStatus,
    toState: registration.registrationStatus,
    reason: notes || rejectionReason,
    req,
  });

  return registration;
}

export async function getAllRegistrationsAdmin(queryParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = '',
    registrationStatus,
    paymentStatus,
    participantCategory,
    attendanceMode,
  } = queryParams;

  const filter = {};

  if (registrationStatus) filter.registrationStatus = registrationStatus;
  if (paymentStatus) filter.paymentStatus = paymentStatus;
  if (participantCategory) filter.participantCategory = participantCategory;
  if (attendanceMode) filter.attendanceMode = attendanceMode;

  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { registrationNumber: { $regex: search, $options: 'i' } },
      { organization: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [registrations, total, statusCounts] = await Promise.all([
    ConferenceRegistration.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('userId', 'name email role')
      .populate('approvedBy', 'name email')
      .lean(),
    ConferenceRegistration.countDocuments(filter),
    ConferenceRegistration.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          approved: { $sum: { $cond: [{ $eq: ['$registrationStatus', 'APPROVED'] }, 1, 0] } },
          pendingPayment: { $sum: { $cond: [{ $eq: ['$registrationStatus', 'PENDING_PAYMENT'] }, 1, 0] } },
          paymentSubmitted: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING_VERIFICATION'] }, 1, 0] } },
          underReview: { $sum: { $cond: [{ $eq: ['$registrationStatus', 'UNDER_REVIEW'] }, 1, 0] } },
          rejected: {
            $sum: {
              $cond: [
                {
                  $or: [
                    { $eq: ['$registrationStatus', 'REJECTED'] },
                    { $eq: ['$paymentStatus', 'REJECTED'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'VERIFIED'] }, '$totalFee', 0],
            },
          },
        },
      },
    ]),
  ]);

  // Attach latest payment submission to each registration
  const regIds = registrations.map((r) => r._id);
  const paymentSubmissions = await PaymentSubmission.find({ registrationId: { $in: regIds } }).lean();
  const paymentMap = {};
  for (const p of paymentSubmissions) {
    paymentMap[p.registrationId.toString()] = p;
  }

  const items = registrations.map((r) => ({
    ...r,
    paymentSubmission: paymentMap[r._id.toString()] || null,
  }));

  const metrics = statusCounts[0] || {
    total: 0,
    approved: 0,
    pendingPayment: 0,
    paymentSubmitted: 0,
    underReview: 0,
    rejected: 0,
    totalRevenue: 0,
  };

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
    metrics,
  };
}

export async function getRegistrationDetailsAdmin(registrationId) {
  const registration = await ConferenceRegistration.findById(registrationId)
    .populate('userId', 'name email role category profile')
    .populate('approvedBy', 'name email')
    .lean();

  if (!registration) {
    throw AppError.notFound('Registration record not found');
  }

  const paymentSubmission = await PaymentSubmission.findOne({ registrationId })
    .populate('verifiedBy', 'name email')
    .populate('attempts.reviewedBy', 'name email')
    .lean();

  const approvalHistory = await RegistrationApprovalHistory.find({ registrationId })
    .sort({ createdAt: -1 })
    .populate('changedBy', 'name email role')
    .lean();

  return {
    registration,
    paymentSubmission,
    approvalHistory,
  };
}

export async function updateFeeSettingsAdmin(newSettings, adminUser, req = null) {
  const current = await getFeeSettings();
  const merged = { ...current, ...newSettings };

  await SystemSetting.findOneAndUpdate(
    { key: 'REGISTRATION_FEE_SETTINGS' },
    {
      key: 'REGISTRATION_FEE_SETTINGS',
      value: merged,
      description: 'Configured fees for IEEE Member / Students, Professionals, and Conference Dinner',
      updatedBy: adminUser._id,
    },
    { upsert: true, new: true }
  );

  await logAuditEvent({
    actor: adminUser,
    action: 'FEE_SETTINGS_UPDATED',
    targetEntity: 'SystemSetting',
    reason: 'Admin updated conference registration fee settings',
    metadata: merged,
    req,
  });

  return merged;
}

export async function getNotifications(userId, role) {
  const query = {
    $or: [
      { recipientId: userId },
      { recipientRole: role, recipientId: null },
    ],
  };

  return await Notification.find(query).sort({ createdAt: -1 }).limit(30).lean();
}

export async function markNotificationRead(notificationId, userId) {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
}

// Server-side Pass and QR Verification for Security Staff and Verify Card View
export async function verifyPassIdentifier(identifier) {
  let registration = null;

  // 1. Try finding by registration number
  registration = await ConferenceRegistration.findOne({ registrationNumber: identifier })
    .populate('userId', 'name email profile')
    .lean();

  // 2. Try finding by MongoDB ID
  if (!registration && identifier.match(/^[0-9a-fA-F]{24}$/)) {
    registration = await ConferenceRegistration.findById(identifier)
      .populate('userId', 'name email profile')
      .lean();
  }

  // 3. Try finding by holding card ID format: ICOSST-<userId>
  if (!registration && identifier.startsWith('ICOSST-')) {
    const rawUserId = identifier.replace('ICOSST-', '');
    if (rawUserId.match(/^[0-9a-fA-F]{24}$/)) {
      registration = await ConferenceRegistration.findOne({ userId: rawUserId })
        .populate('userId', 'name email profile')
        .lean();
    }
  }

  // 4. Try finding by qrCodeToken
  if (!registration) {
    registration = await ConferenceRegistration.findOne({ qrCodeToken: identifier })
      .populate('userId', 'name email profile')
      .lean();
  }

  if (!registration) {
    return {
      isValid: false,
      status: 'NOT_FOUND',
      title: 'CREDENTIAL NOT FOUND',
      message: 'No conference registration found for the provided identifier. Gate entry denied.',
      badgeVariant: 'destructive',
    };
  }

  if (registration.registrationStatus !== 'APPROVED' || registration.paymentStatus !== 'VERIFIED') {
    return {
      isValid: false,
      status: registration.registrationStatus,
      title: 'ACCESS RESTRICTED — NOT APPROVED',
      attendee: registration.fullName,
      registrationNumber: registration.registrationNumber,
      category: registration.participantCategory,
      organization: registration.organization,
      message: `Registration is currently in '${registration.registrationStatus}' state (Payment: ${registration.paymentStatus}). Digital pass activation requires official finance and administrative approval.`,
      badgeVariant: 'destructive',
    };
  }

  // Fully confirmed and approved delegate
  const mealsEntitled = [
    'Day 1 Morning High Tea',
    'Day 1 Networking Lunch',
    'Day 1 Evening Refreshments',
    'Day 2 Networking Lunch',
    'Day 2 Evening Tea',
  ];
  if (registration.attendDinner) {
    mealsEntitled.push('Official Conference Gala Dinner (Confirmed)');
  }

  return {
    isValid: true,
    status: 'CONFIRMED',
    title: 'OFFICIALLY VERIFIED & APPROVED',
    attendee: registration.fullName,
    email: registration.email,
    registrationNumber: registration.registrationNumber,
    category: registration.participantCategory === 'IEEE_MEMBER_STUDENT' ? 'IEEE Member / Student' : 'Non-IEEE Member / Professional',
    organization: registration.organization,
    attendanceMode: registration.attendanceMode,
    dinnerIncluded: registration.attendDinner,
    mealsEntitled,
    approvedAt: registration.approvedAt,
    badgeVariant: 'success',
  };
}

// Generate official printable PDF delegate slip
export async function generateDelegateSlipPdf(registrationId, res) {
  const registration = await ConferenceRegistration.findById(registrationId)
    .populate('approvedBy', 'name email')
    .lean();

  if (!registration) {
    throw AppError.notFound('Registration not found');
  }

  if (registration.registrationStatus !== 'APPROVED') {
    throw AppError.badRequest('Delegate slip is only available after registration is officially APPROVED.');
  }

  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="ICOSST-2026-Delegate-Slip-${registration.registrationNumber}.pdf"`
  );

  doc.pipe(res);

  // Background Header Banner
  doc.rect(40, 40, 515, 80).fill('#0b4f35');

  // Title
  doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
    .text('20th IEEE ICOSST 2026', 55, 55);
  doc.fontSize(10).font('Helvetica')
    .text('International Conference on Open Source Systems & Technologies', 55, 78)
    .text('Al-Khawarizmi Institute of Computer Science (KICS), UET Lahore, Pakistan', 55, 93);

  // Status Badge
  doc.rect(420, 52, 120, 26).fill('#fbbf24');
  doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold')
    .text('CONFIRMED PASS', 432, 60);

  doc.moveDown(4);

  // Credential Header
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold')
    .text('OFFICIAL DELEGATE ENTRY VOUCHER & CLEARANCE SLIP', 40, 145);
  doc.fontSize(9).font('Helvetica')
    .fillColor('#64748b')
    .text('Present this document at the UET main security gates and KICS conference registration foyer.', 40, 163);

  // Registration ID Box
  doc.rect(40, 185, 515, 36).fill('#f1f5f9');
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold')
    .text(`REGISTRATION NUMBER:   ${registration.registrationNumber}`, 55, 198);

  // Table Data
  let yPos = 240;
  const rowHeight = 24;

  const fields = [
    ['Participant Name:', registration.fullName],
    ['Affiliation / University:', registration.organization],
    ['Email Address:', registration.email],
    ['Contact Phone:', registration.phone],
    ['Registered Category:', registration.participantCategory === 'IEEE_MEMBER_STUDENT' ? 'IEEE Member / Student' : 'Non-IEEE Member / Professional'],
    ['IEEE Membership #:', registration.isIeeeMember ? (registration.ieeeMembershipNumber || 'Verified') : 'Not Applicable'],
    ['Attendance Mode:', registration.attendanceMode === 'PHYSICAL' ? 'Physical Attendance (KICS UET Lahore)' : 'Virtual Attendance'],
    ['Conference Gala Dinner:', registration.attendDinner ? 'Included & Paid (PKR 5,000)' : 'Not Included'],
    ['Total Registration Fee Paid:', `${registration.currency} ${registration.totalFee.toLocaleString()} (Verified by Finance)`],
    ['Approval Date:', registration.approvedAt ? new Date(registration.approvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Verified'],
  ];

  for (let i = 0; i < fields.length; i++) {
    const [label, val] = fields[i];
    if (i % 2 === 0) {
      doc.rect(40, yPos - 4, 515, rowHeight).fill('#f8fafc');
    }
    doc.fillColor('#475569').fontSize(10).font('Helvetica-Bold').text(label, 55, yPos);
    doc.fillColor('#0f172a').fontSize(10).font('Helvetica').text(String(val), 220, yPos);
    yPos += rowHeight;
  }

  // Selected Activities
  yPos += 10;
  doc.fillColor('#0b4f35').fontSize(11).font('Helvetica-Bold')
    .text('Selected Conference Activities:', 55, yPos);
  yPos += 18;
  const activities = registration.selectedActivities?.length
    ? registration.selectedActivities
    : ['Keynote Addresses', 'Technical Sessions', 'Exhibition Foyer', 'Closing Ceremony'];

  for (const act of activities) {
    doc.fillColor('#334155').fontSize(9).font('Helvetica')
      .text(`•  ${act}`, 70, yPos);
    yPos += 15;
  }

  // Refreshment & Clearance Instructions Box
  yPos += 15;
  doc.rect(40, yPos, 515, 60).fill('#ecfdf5');
  doc.rect(40, yPos, 515, 60).stroke('#10b981');
  doc.fillColor('#065f46').fontSize(10).font('Helvetica-Bold')
    .text('GATE ACCESS & REFRESHMENT ENTITLEMENT CONFIRMED', 55, yPos + 12);
  doc.fillColor('#047857').fontSize(8.5).font('Helvetica')
    .text('Entitled to Day 1 & Day 2 Networking Lunch, Refreshments & Conference Delegate Welcome Kit.', 55, yPos + 28);
  if (registration.attendDinner) {
    doc.text('Gala Dinner entry clearance token is activated for this credential.', 55, yPos + 42);
  }

  // Signatures / Seals
  yPos += 90;
  doc.moveTo(55, yPos).lineTo(220, yPos).stroke('#94a3b8');
  doc.moveTo(335, yPos).lineTo(500, yPos).stroke('#94a3b8');

  doc.fillColor('#475569').fontSize(9).font('Helvetica-Bold')
    .text('Finance & Verification Chair', 65, yPos + 8)
    .text('ICOSST 2026 Organizing Secretariat', 340, yPos + 8);
  doc.fillColor('#94a3b8').fontSize(8).font('Helvetica')
    .text('KICS UET Lahore', 95, yPos + 20)
    .text('Steering Committee Approval', 355, yPos + 20);

  // Footer Note
  doc.fillColor('#94a3b8').fontSize(7.5).font('Helvetica')
    .text(
      'This is an authoritative computer-generated verification document issued by the ICOSST 2026 Conference Management System. Tampering is strictly prohibited.',
      40,
      770,
      { align: 'center', width: 515 }
    );

  doc.end();
}
