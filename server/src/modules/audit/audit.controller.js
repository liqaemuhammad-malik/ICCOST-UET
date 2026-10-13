import * as auditService from './audit.service.js';

export async function listAuditLogs(req, res, next) {
  try {
    const { page, limit, targetEntity, action, actorId } = req.query;
    const result = await auditService.getAuditLogs({
      page,
      limit,
      targetEntity,
      action,
      actorId,
    });
    res.json({ success: true, data: result.logs, meta: result.pagination });
  } catch (err) {
    next(err);
  }
}
