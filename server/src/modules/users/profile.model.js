import mongoose from 'mongoose';
import { PARTICIPANT_CATEGORIES } from '../../config/constants.js';

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    categoryCode: {
      type: String,
      enum: Object.values(PARTICIPANT_CATEGORIES),
      default: PARTICIPANT_CATEGORIES.STUDENT_FACULTY,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    cnicOrPassport: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    institution: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    studentOrEmployeeId: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'Pakistan',
    },
    tShirtSize: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'NONE'],
      default: 'NONE',
    },
    dietaryPreference: {
      type: String,
      enum: ['STANDARD', 'VEGETARIAN', 'HALAL_CHICKEN', 'SPECIAL_DIET'],
      default: 'STANDARD',
    },
    // Dynamic fields configured per category in ParticipantCategory.requiredProfileFields
    customFieldData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model('Profile', profileSchema);
