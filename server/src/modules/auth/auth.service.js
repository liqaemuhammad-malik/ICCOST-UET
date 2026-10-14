import crypto from 'crypto';
import { User } from '../users/user.model.js';
import { AppError } from '../../utils/appError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} from '../../utils/cryptoHelper.js';
import { createUser, getUserWithProfile } from '../users/user.service.js';
import { queueEmail } from '../../config/mailer.js';
import { env } from '../../config/env.js';
import { logAuditEvent } from '../audit/audit.service.js';
import { authenticateStudent } from './lms.service.js';


export async function register(data, req = null) {
  const { user, rawVerificationToken } = await createUser(data);

  // Dispatch verification email
  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${rawVerificationToken}`;
  await queueEmail({
    to: user.email,
    subject: 'ICOSST 2026 — Verify your Conference Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0b4f35; border-bottom: 2px solid #0b4f35; padding-bottom: 8px;">
          20th International Conference on Open Source Systems and Technologies (ICOSST 2026)
        </h2>
        <p>Dear ${user.name},</p>
        <p>Thank you for creating an account on the ICOSST 2026 platform (KICS, UET Lahore). Please verify your email address to continue with your conference registration, workshop booking, or competition team setup.</p>
        <div style="margin: 25px 0;">
          <a href="${verificationUrl}" style="background-color: #0b4f35; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser: <br/><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">This link will expire in 24 hours. If you did not create this account, please disregard this email.</p>
      </div>
    `,
  });

  await logAuditEvent({
    actor: user,
    action: 'USER_REGISTERED',
    targetEntity: 'User',
    targetId: user._id,
    toState: { email: user.email, role: user.role, category: user.category },
    reason: 'User self-registration with category',
    req,
  });

  const tokenPayload = { userId: user._id, role: user.role, email: user.email, category: user.category };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  const fullUser = await getUserWithProfile(user._id);

  return {
    accessToken,
    refreshToken,
    user: fullUser,
    userId: user._id,
    name: fullUser.name,
    email: fullUser.email,
    role: fullUser.role,
    category: fullUser.category,
    isEmailVerified: fullUser.isEmailVerified,
    rawVerificationToken: rawVerificationToken,
  };
}

export async function verifyEmail(token, req = null) {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw AppError.badRequest('Invalid or expired email verification link', 'INVALID_VERIFICATION_TOKEN');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  await logAuditEvent({
    actor: user,
    action: 'EMAIL_VERIFIED',
    targetEntity: 'User',
    targetId: user._id,
    reason: 'Email verified successfully',
    req,
  });

  return { message: 'Email verified successfully. You may now log in.' };
}

export async function login(email, password, accountType = 'ATTENDEE', req = null) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash +refreshTokenHash');

  if (!user) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw AppError.forbidden('Your account has been deactivated. Please contact support.', 'ACCOUNT_DEACTIVATED');
  }

  const isMatch = await user.comparePassword(password);

  // Student accounts use the UET LMS as the credential authority. The local
  // password hash remains useful for tests and for non-student accounts, but
  // normal student logins always validate against the LMS.
  if (accountType === 'PARTICIPANT' && env.NODE_ENV !== 'test') {
    const lmsResult = await authenticateStudent(email.toLowerCase(), password);
    if (!lmsResult.authenticated) {
      throw AppError.unauthorized('Invalid UET LMS credentials', 'INVALID_CREDENTIALS');
    }
  } else if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // Issue tokens
  const tokenPayload = { userId: user._id, role: user.role, email: user.email, category: user.category };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store hashed refresh token
  user.refreshTokenHash = hashToken(refreshToken);
  user.lastLoginAt = new Date();
  await user.save();

  await logAuditEvent({
    actor: user,
    action: 'USER_LOGIN',
    targetEntity: 'User',
    targetId: user._id,
    reason: 'Successful user authentication',
    req,
  });

  const fullUser = await getUserWithProfile(user._id);

  return {
    accessToken,
    refreshToken,
    user: fullUser,
  };
}

export async function refreshAccessToken(oldRefreshToken) {
  if (!oldRefreshToken) {
    throw AppError.unauthorized('Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw AppError.unauthorized('Refresh token expired or invalid', 'INVALID_REFRESH_TOKEN');
  }

  const hashedOldToken = hashToken(oldRefreshToken);
  const user = await User.findById(decoded.userId).select('+refreshTokenHash');

  if (!user || user.refreshTokenHash !== hashedOldToken) {
    throw AppError.unauthorized('Refresh token revoked or invalid', 'INVALID_REFRESH_TOKEN');
  }

  const tokenPayload = { userId: user._id, role: user.role, email: user.email };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Rotate refresh token
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Return success to avoid email enumeration
    return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
  }

  const rawToken = user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
  await queueEmail({
    to: user.email,
    subject: 'ICOSST 2026 — Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #0b4f35;">ICOSST 2026 Password Reset</h2>
        <p>Dear ${user.name},</p>
        <p>We received a request to reset your password. Click the button below to choose a new password:</p>
        <div style="margin: 25px 0;">
          <a href="${resetUrl}" style="background-color: #0b4f35; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #64748b;">Or paste this link into your browser: <br/><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">This link will expire in 1 hour. If you did not request this, you may safely ignore this email.</p>
      </div>
    `,
  });

  return { message: 'If an account exists with this email, a password reset link has been dispatched.' };
}

export async function resetPassword(token, newPassword, req = null) {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw AppError.badRequest('Invalid or expired password reset token', 'INVALID_RESET_TOKEN');
  }

  user.passwordHash = newPassword; // Pre-save hook hashes it
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokenHash = null; // Invalidate current sessions
  await user.save();

  await logAuditEvent({
    actor: user,
    action: 'PASSWORD_RESET',
    targetEntity: 'User',
    targetId: user._id,
    reason: 'User successfully completed password reset',
    req,
  });

  return { message: 'Password has been updated successfully. Please log in with your new password.' };
}
