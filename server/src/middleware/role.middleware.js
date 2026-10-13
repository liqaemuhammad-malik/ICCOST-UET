import { AppError } from '../utils/appError.js';
import { ROLES } from '../config/constants.js';

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required to access this resource'));
    }

    // super_admin always bypasses role checks
    if (req.user.role === ROLES.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        AppError.forbidden(
          `Access denied. Role '${req.user.role}' does not have required permissions: [${allowedRoles.join(', ')}]`
        )
      );
    }

    next();
  };
}
