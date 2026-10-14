import * as authService from './auth.service.js';
import * as userService from '../users/user.service.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/appError.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
  });
}

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body, req);
    if (result.refreshToken) {
      setRefreshCookie(res, result.refreshToken);
    }
    res.status(201).json({
      success: true,
      data: result,
      message: 'Account created successfully. Welcome to ICOSST 2026!',
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const result = await authService.verifyEmail(req.body.token, req);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, accountType } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password, accountType, req);

    setRefreshCookie(res, refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        user,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const { accessToken, refreshToken: newRefreshToken } = await authService.refreshAccessToken(refreshToken);

    setRefreshCookie(res, newRefreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    if (req.user?._id) {
      await authService.logout(req.user._id);
    }
    clearRefreshCookie(res);
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.body.email);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.body.token, req.body.newPassword, req);
    res.json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const fullUser = await userService.getUserWithProfile(req.user._id);
    res.json({
      success: true,
      data: fullUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updatedProfile = await userService.updateProfile(req.user._id, req.body, req.user);
    res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadProfilePhoto(req, res, next) {
  try {
    if (!req.file) {
      return next(AppError.badRequest('Profile photo is required', 'PROFILE_PHOTO_REQUIRED'));
    }

    const profileImageUrl = `/uploads/${req.file.filename}`;
    await userService.updateProfilePhoto(req.user._id, profileImageUrl);
    const fullUser = await userService.getUserWithProfile(req.user._id);

    res.json({
      success: true,
      data: fullUser,
      message: 'Profile photo uploaded successfully',
    });
  } catch (err) {
    next(err);
  }
}
