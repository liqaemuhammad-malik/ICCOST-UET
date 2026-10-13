import nodemailer from 'nodemailer';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import { emailQueue } from './queue.js';

let transporter = null;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
    });
  }
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  try {
    const transport = getTransporter();
    const info = await transport.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });
    logger.info({ to, subject, messageId: info.messageId }, 'Email sent successfully via SMTP');
    return info;
  } catch (err) {
    // Development fallback: Log email clearly to console so user can copy verification links/passwords
    logger.warn({ to, subject, error: err.message }, 'SMTP server unavailable. Logging email content to terminal for development:');
    logger.info(`\n================================ EMAIL PREVIEW ================================\nTO: ${to}\nSUBJECT: ${subject}\nBODY:\n${text || html}\n===============================================================================\n`);
    return { devPreview: true, to, subject };
  }
}

// Queue worker for background email delivery
emailQueue.process(async (job) => {
  const { to, subject, html, text } = job.data;
  return await sendEmail({ to, subject, html, text });
});

export function queueEmail(data) {
  return emailQueue.add('sendEmail', data);
}
