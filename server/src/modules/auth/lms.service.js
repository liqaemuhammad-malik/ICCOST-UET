import { env } from '../../config/env.js';
import { AppError } from '../../utils/appError.js';

/**
 * Authenticate a student against the UET Odoo LMS.
 * The password is sent only to the LMS and is never persisted or logged here.
 */
export async function authenticateStudent(login, password) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.LMS_TIMEOUT_SECONDS * 1000);

  try {
    const response = await fetch(`${env.LMS_API_URL.replace(/\/$/, '')}${env.LMS_API_ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: env.LMS_DB_NAME,
          login,
          password,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`LMS returned HTTP ${response.status}`);
    }

    const payload = await response.json();
    if (payload.error || !payload.result?.uid) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      uid: payload.result.uid,
      name: payload.result.name || payload.result.username || login,
      session: payload.result,
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    // Do not turn a temporary LMS outage into a 500 or leak upstream details.
    throw AppError.serviceUnavailable(
      'The UET LMS is temporarily unavailable. Please try again shortly.',
      'LMS_UNAVAILABLE'
    );
  } finally {
    clearTimeout(timeout);
  }
}
