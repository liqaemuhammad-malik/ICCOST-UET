import { User } from './user.model.js';
import { Profile } from './profile.model.js';
import { AppError } from '../../utils/appError.js';
import { getCategoryByCode } from '../categories/category.service.js';
import { logAuditEvent } from '../audit/audit.service.js';

export async function createUser({ name, email, password, role = 'participant', category = 'ATTENDEE_PARTICIPANT', institution = '' }) {
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw AppError.conflict('An account with this email address already exists', 'EMAIL_ALREADY_EXISTS');
  }

  let userRole = role;
  if (category === 'ORGANIZER' && role === 'participant') {
    userRole = 'organizer';
  }

  const user = new User({
    name,
    email: email.toLowerCase(),
    passwordHash: password, // Pre-save hook hashes it
    role: userRole,
    category: category || 'ATTENDEE_PARTICIPANT',
    isEmailVerified: false,
  });

  const rawVerificationToken = user.createEmailVerificationToken();
  await user.save();

  // Create default linked profile
  const profile = await Profile.create({
    userId: user._id,
    categoryCode: category || 'ATTENDEE_PARTICIPANT',
    institution: institution || '',
  });

  return { user, profile, rawVerificationToken };
}

export async function getUserWithProfile(userId) {
  const user = await User.findById(userId).select('-passwordHash').lean();
  if (!user) {
    throw AppError.notFound('User not found');
  }

  const profile = await Profile.findOne({ userId }).lean();
  return { ...user, profile };
}

export async function updateProfile(userId, profileData, actor = null) {
  let profile = await Profile.findOne({ userId });
  if (!profile) {
    profile = new Profile({ userId });
  }

  const fromState = profile.toObject();

  // If changing category, validate category exists
  if (profileData.categoryCode && profileData.categoryCode !== profile.categoryCode) {
    await getCategoryByCode(profileData.categoryCode);
    profile.categoryCode = profileData.categoryCode;
  }

  // Update core fields if provided
  const standardFields = [
    'phone',
    'cnicOrPassport',
    'institution',
    'studentOrEmployeeId',
    'department',
    'designation',
    'city',
    'country',
    'tShirtSize',
    'dietaryPreference',
  ];

  standardFields.forEach((field) => {
    if (profileData[field] !== undefined) {
      profile[field] = profileData[field];
    }
  });

  // Merge custom dynamic fields
  if (profileData.customFieldData) {
    profile.customFieldData = {
      ...(profile.customFieldData || {}),
      ...profileData.customFieldData,
    };
  }

  // Check completeness: institution, phone, and cnicOrPassport filled
  if (profile.institution && profile.phone) {
    profile.isProfileCompleted = true;
  }

  await profile.save();

  await logAuditEvent({
    actor: actor || { _id: userId, role: 'participant' },
    action: 'UPDATE_PROFILE',
    targetEntity: 'Profile',
    targetId: profile._id,
    fromState,
    toState: profile.toObject(),
    reason: 'User updated profile details',
  });

  return profile;
}
