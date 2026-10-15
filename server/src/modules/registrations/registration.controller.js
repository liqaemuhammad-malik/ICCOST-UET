import * as regService from './registration.service.js';
import {
  createRegistrationSchema,
  submitPaymentSchema,
  reviewPaymentSchema,
  reviewRegistrationSchema,
  updateFeeSettingsSchema,
} from './registration.validation.js';
import { AppError } from '../../utils/appError.js';

export async function getBankAndFeeConfig(req, res, next) {
  try {
    const [bankDetails, feeSettings] = await Promise.all([
      regService.getBankDetails(),
      regService.getFeeSettings(),
    ]);

    res.json({
      success: true,
      data: {
        bankDetails,
        feeSettings,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function calculateFee(req, res, next) {
  try {
    const { participantCategory, attendanceMode, attendDinner } = req.body;
    const feeSummary = await regService.calculateRegistrationFee({
      participantCategory,
      attendanceMode,
      attendDinner: Boolean(attendDinner),
    });

    res.json({
      success: true,
      data: feeSummary,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyRegistration(req, res, next) {
  try {
    const registration = await regService.getMyRegistration(req.user._id);

    res.json({
      success: true,
      data: registration,
    });
  } catch (err) {
    next(err);
  }
}

export async function createOrUpdateRegistration(req, res, next) {
  try {
    const validatedData = createRegistrationSchema.parse(req.body);
    const registration = await regService.createOrUpdateRegistration(
      req.user._id,
      validatedData,
      req
    );

    res.status(201).json({
      success: true,
      message: 'Conference registration saved successfully',
      data: registration,
    });
  } catch (err) {
    next(err);
  }
}

export async function submitPayment(req, res, next) {
  try {
    const validatedData = submitPaymentSchema.parse(req.body);
    const result = await regService.submitPaymentEvidence(
      req.user._id,
      validatedData,
      req.file,
      req
    );

    res.status(200).json({
      success: true,
      message: 'Payment proof submitted successfully for verification',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function downloadMyDelegateSlip(req, res, next) {
  try {
    const registration = await regService.getMyRegistration(req.user._id);
    if (!registration) {
      throw AppError.notFound('No conference registration found for this account.');
    }

    await regService.generateDelegateSlipPdf(registration._id, res);
  } catch (err) {
    next(err);
  }
}

export async function downloadDelegateSlipById(req, res, next) {
  try {
    const { id } = req.params;
    await regService.generateDelegateSlipPdf(id, res);
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req, res, next) {
  try {
    const notifications = await regService.getNotifications(req.user._id, req.user.role);

    res.json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params;
    const notification = await regService.markNotificationRead(id, req.user._id);

    res.json({
      success: true,
      data: notification,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyPass(req, res, next) {
  try {
    const { identifier } = req.params;
    const result = await regService.verifyPassIdentifier(identifier);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminGetAllRegistrations(req, res, next) {
  try {
    const result = await regService.getAllRegistrationsAdmin(req.query);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminGetRegistrationDetails(req, res, next) {
  try {
    const { id } = req.params;
    const result = await regService.getRegistrationDetailsAdmin(id);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminReviewPayment(req, res, next) {
  try {
    const { id } = req.params;
    const validated = reviewPaymentSchema.parse(req.body);
    const result = await regService.adminReviewPayment(id, validated, req.user, req);

    res.json({
      success: true,
      message: `Payment status updated to ${result.paymentSubmission.verificationStatus}`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminReviewRegistration(req, res, next) {
  try {
    const { id } = req.params;
    const validated = reviewRegistrationSchema.parse(req.body);
    const result = await regService.adminReviewRegistration(id, validated, req.user, req);

    res.json({
      success: true,
      message: `Registration status updated to ${result.registrationStatus}`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminGetFeeSettings(req, res, next) {
  try {
    const settings = await regService.getFeeSettings();

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateFeeSettings(req, res, next) {
  try {
    const validated = updateFeeSettingsSchema.parse(req.body);
    const result = await regService.updateFeeSettingsAdmin(validated, req.user, req);

    res.json({
      success: true,
      message: 'Fee settings updated successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
