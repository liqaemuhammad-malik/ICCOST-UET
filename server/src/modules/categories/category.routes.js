import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from './category.validation.js';
import { ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', optionalAuthenticate, categoryController.listCategories);
router.get('/:code', categoryController.getCategory);

// Admin-only management routes
router.post(
  '/',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(createCategorySchema),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  requireRole(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  validate(updateCategorySchema),
  categoryController.updateCategory
);

export default router;
