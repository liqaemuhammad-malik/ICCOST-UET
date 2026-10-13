import mongoose from 'mongoose';
import { ACTIVITY_TYPES } from '../../config/constants.js';

const requiredFieldSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'number', 'email', 'select', 'file', 'checkbox', 'textarea'],
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: [String], // for select type
      default: [],
    },
    helpText: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const participantCategorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    requiredProfileFields: {
      type: [requiredFieldSchema],
      default: [],
    },
    requiresApproval: {
      type: Boolean,
      default: false,
    },
    requiresInvitation: {
      type: Boolean,
      default: false,
    },
    allowedActivityTypes: {
      type: [String],
      enum: Object.values(ACTIVITY_TYPES),
      default: [ACTIVITY_TYPES.KEYNOTE, ACTIVITY_TYPES.TECHNICAL_SESSION],
    },
    badgeColor: {
      type: String,
      default: '#0b4f35', // UET Green default
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ParticipantCategory = mongoose.model('ParticipantCategory', participantCategorySchema);
