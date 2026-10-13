import { AuditLog } from './audit.model.js';
import { logger } from '../../utils/logger.js';

export async function logAuditEvent({
  actor = null,
  action,
  targetEntity,
  targetId = null,
  fromState = null,
  toState = null,
  reason = null,
  metadata = {},
  req = null,
}) {
  try {
    const actorId = actor?._id || req?.user?._id || null;
    const actorRole = actor?.role || req?.user?.role || 'system';
    const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || 'internal';
    const userAgent = req?.headers?.['user-agent'] || 'internal';

    const entry = await AuditLog.create({
      actorId,
      actorRole,
      ipAddress,
      userAgent,
      action,
      targetEntity,
      targetId,
      fromState,
      toState,
      reason,
      metadata,
    });

    return entry;
  } catch (err) {
    // Audit logging should not crash the primary operational flow, but must log loudly
    logger.error({ err: err.message, action, targetEntity }, 'Failed to record audit log entry');
    return null;
  }
}

export async function getAuditLogs({ page = 1, limit = 50, targetEntity, action, actorId } = {}) {
  const query = {};
  if (targetEntity) query.targetEntity = targetEntity;
  if (action) query.action = action;
  if (actorId) query.actorId = actorId;

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('actorId', 'name email role')
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
