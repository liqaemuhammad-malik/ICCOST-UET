import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { upload } from '../../middleware/upload.middleware.js';
import { ROLES } from '../../config/constants.js';
import * as regController from './registration.controller.js';

const router = Router();

// Public / Scanner Verification
router.get('/config', regController.getBankAndFeeConfig);
router.post('/calculate-fee', regController.calculateFee);
router.get('/verify-pass/:identifier', regController.verifyPass);

// Authenticated Participant Endpoints
router.use(authenticate);

router.get('/my', regController.getMyRegistration);
router.post('/', regController.createOrUpdateRegistration);
router.post('/payment', upload.single('receipt'), regController.submitPayment);
router.get('/my/delegate-slip', regController.downloadMyDelegateSlip);

router.get('/notifications', regController.getNotifications);
router.patch('/notifications/:id/read', regController.markNotificationRead);

// Administrative Endpoints (Admin, Super Admin, Finance, Approver)
const ADMIN_ROLES = [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.FINANCE, ROLES.APPROVER];

router.get('/admin/all', requireRole(...ADMIN_ROLES), regController.adminGetAllRegistrations);
router.get('/admin/fee-settings', requireRole(...ADMIN_ROLES), regController.adminGetFeeSettings);
router.put('/admin/fee-settings', requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.FINANCE), regController.adminUpdateFeeSettings);
router.get('/admin/:id', requireRole(...ADMIN_ROLES), regController.adminGetRegistrationDetails);
router.get('/admin/:id/delegate-slip', requireRole(...ADMIN_ROLES), regController.downloadDelegateSlipById);
router.post('/admin/:id/review-payment', requireRole(...ADMIN_ROLES), regController.adminReviewPayment);
router.post('/admin/:id/review-registration', requireRole(...ADMIN_ROLES), regController.adminReviewRegistration);

export default router;
