import { Router } from 'express';
import * as settingController from './setting.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', settingController.listSettings);
router.put('/:key', authenticate, requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN), settingController.updateSetting);

export default router;
