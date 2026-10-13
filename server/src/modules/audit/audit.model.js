import mongoose from 'mongoose';
import { AppError } from '../../utils/appError.js';

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actorRole: {
      type: String,
      default: 'system',
    },
    ipAddress: {
      type: String,
      default: 'unknown',
    },
    userAgent: {
      type: String,
      default: 'unknown',
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetEntity: {
      type: String,
      required: true,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    fromState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    toState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    reason: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // append-only: no updatedAt
  }
);

// Indexes
auditLogSchema.index({ targetEntity: 1, targetId: 1 });
auditLogSchema.index({ actorId: 1 });
auditLogSchema.index({ createdAt: -1 });

// Strictly block updates and deletes at the Mongoose middleware level
auditLogSchema.pre('updateOne', function () {
  throw AppError.forbidden('Audit logs are append-only. Updates are strictly forbidden.');
});

auditLogSchema.pre('updateMany', function () {
  throw AppError.forbidden('Audit logs are append-only. Updates are strictly forbidden.');
});

auditLogSchema.pre('findOneAndUpdate', function () {
  throw AppError.forbidden('Audit logs are append-only. Updates are strictly forbidden.');
});

auditLogSchema.pre('deleteOne', function () {
  throw AppError.forbidden('Audit logs are append-only. Deletions are strictly forbidden.');
});

auditLogSchema.pre('deleteMany', function () {
  throw AppError.forbidden('Audit logs are append-only. Deletions are strictly forbidden.');
});

auditLogSchema.pre('findOneAndDelete', function () {
  throw AppError.forbidden('Audit logs are append-only. Deletions are strictly forbidden.');
});

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
