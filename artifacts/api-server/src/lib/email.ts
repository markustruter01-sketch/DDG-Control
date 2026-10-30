import nodemailer from 'nodemailer';
import { logger } from './logger';

/** Emails Markus. Off (returns false) until EMAIL_SMTP_URL, EMAIL_FROM and OWNER_EMAIL are set in
 *  Replit Secrets. Never throws: a failed email is logged and the caller carries on. */
export async function emailOwner(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const url = process.env.EMAIL_SMTP_URL;
  const from = process.env.EMAIL_FROM;
  const to = process.env.OWNER_EMAIL;
  if (!url || !from || !to) return false;
  try {
    await nodemailer.createTransport(url).sendMail({ from, to, subject, text, replyTo });
    return true;
  } catch (err) {
    logger.error({ err: err instanceof Error ? err.message : String(err) }, 'owner email failed');
    return false;
  }
}
