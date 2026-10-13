import { Router } from 'express';
import * as auditController from './audit.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.get(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  auditController.listAuditLogs
);

export default router;
