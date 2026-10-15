import mongoose from 'mongoose';

const conferenceRegistrationSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventId: {
      type: String,
      default: 'ICOSST_2026',
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Organization / Institute is required'],
      trim: true,
    },
    isIeeeMember: {
      type: Boolean,
      default: false,
    },
    ieeeMembershipNumber: {
      type: String,
      default: '',
      trim: true,
    },
    participantCategory: {
      type: String,
      enum: ['IEEE_MEMBER_STUDENT', 'NON_IEEE_PROFESSIONAL'],
      required: true,
    },
    attendanceMode: {
      type: String,
      enum: ['PHYSICAL', 'VIRTUAL'],
      default: 'PHYSICAL',
    },
    selectedActivities: {
      type: [String],
      default: [],
    },
    attendDinner: {
      type: Boolean,
      default: false,
    },
    registrationFee: {
      type: Number,
      required: true,
    },
    dinnerFee: {
      type: Number,
      required: true,
      default: 0,
    },
    totalFee: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    registrationStatus: {
      type: String,
      enum: ['DRAFT', 'PENDING_PAYMENT', 'PAYMENT_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING_PAYMENT',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['NOT_SUBMITTED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'RESUBMISSION_REQUESTED'],
      default: 'NOT_SUBMITTED',
      index: true,
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    resubmissionNotes: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    qrCodeToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const paymentSubmissionSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConferenceRegistration',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: 'BANK_TRANSFER',
    },
    transactionReference: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'PKR',
    },
    receiptFile: {
      url: { type: String, required: true },
      filename: { type: String },
      mimetype: { type: String },
      size: { type: Number },
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'RESUBMISSION_REQUESTED'],
      default: 'PENDING_VERIFICATION',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    attempts: [
      {
        attemptNumber: Number,
        transactionReference: String,
        paymentDate: Date,
        amountPaid: Number,
        receiptFile: Object,
        submittedAt: { type: Date, default: Date.now },
        verificationStatus: String,
        adminNotes: String,
        rejectionReason: String,
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviewedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const registrationApprovalHistorySchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ConferenceRegistration',
      required: true,
      index: true,
    },
    paymentSubmissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentSubmission',
      default: null,
    },
    previousRegistrationStatus: {
      type: String,
    },
    newRegistrationStatus: {
      type: String,
    },
    previousPaymentStatus: {
      type: String,
    },
    newPaymentStatus: {
      type: String,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorRole: {
      type: String,
      default: 'admin',
    },
    action: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null, // null = broadcast to all admins
    },
    recipientRole: {
      type: String,
      default: 'participant',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['REGISTRATION', 'PAYMENT', 'APPROVAL', 'REJECTION', 'INFO'],
      default: 'INFO',
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const ConferenceRegistration = mongoose.model(
  'ConferenceRegistration',
  conferenceRegistrationSchema
);

export const PaymentSubmission = mongoose.model(
  'PaymentSubmission',
  paymentSubmissionSchema
);

export const RegistrationApprovalHistory = mongoose.model(
  'RegistrationApprovalHistory',
  registrationApprovalHistorySchema
);

export const Notification = mongoose.model(
  'Notification',
  notificationSchema
);
