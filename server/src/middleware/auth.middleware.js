import { verifyAccessToken } from '../utils/cryptoHelper.js';
import { AppError } from '../utils/appError.js';
import { User } from '../modules/users/user.model.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw AppError.unauthorized('Authentication token missing');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      throw AppError.unauthorized('User associated with this token no longer exists');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export function optionalAuthenticate(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = verifyAccessToken(token);
    User.findById(decoded.userId)
      .select('-passwordHash')
      .then((user) => {
        req.user = user && user.isActive ? user : null;
        next();
      })
      .catch(() => {
        req.user = null;
        next();
      });
  } catch {
    req.user = null;
    next();
  }
}
