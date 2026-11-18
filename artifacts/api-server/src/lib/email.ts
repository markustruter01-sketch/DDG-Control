import nodemailer from 'nodemailer';
import { logger } from './logger';

const NAMES = ['EMAIL_SMTP_URL', 'EMAIL_FROM', 'OWNER_EMAIL'] as const;
/** Last send result since the server started. Times only: never the address, the error text or a secret. */
const last = { sentAt: null as Date | null, failedAt: null as Date | null };
const note = (ok: boolean) => { if (ok) last.sentAt = new Date(); else last.failedAt = new Date(); };

/** For Control's Connections panel. Names the missing settings; never shows a value. */
export function emailStatus() {
  const missing = NAMES.filter((n) => !process.env[n]);
  const failedLast = !!last.failedAt && (!last.sentAt || last.failedAt > last.sentAt);
  return { missing, sentAt: last.sentAt, failedAt: last.failedAt, failedLast };
}

/** Emails Markus. Off (returns false) until EMAIL_SMTP_URL, EMAIL_FROM and OWNER_EMAIL are set in
 *  Replit Secrets. Never throws: a failed email is logged and the caller carries on. */
export async function emailOwner(subject: string, text: string, replyTo?: string): Promise<boolean> {
  const url = process.env.EMAIL_SMTP_URL;
  const from = process.env.EMAIL_FROM;
  const to = process.env.OWNER_EMAIL;
  if (!url || !from || !to) return false;
  try {
    await nodemailer.createTransport(url).sendMail({ from, to, subject, text, replyTo });
    note(true);
    return true;
  } catch (err) {
    note(false);
    logger.error({ err: err instanceof Error ? err.message : String(err) }, 'owner email failed');
    return false;
  }
}

const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** The "we have your enquiry" email to the person who sent the website form. Same mail service and
 *  sender as emailOwner. Their own words are shown back to them as plain, escaped text. Never throws. */
export async function emailEnquiryReceived(to: string, name: string, lines: string[]): Promise<boolean> {
  const url = process.env.EMAIL_SMTP_URL;
  const from = process.env.EMAIL_FROM;
  if (!url || !from) return false;
  const first = name.trim().split(/\s+/)[0] || 'there';
  const contact = 'info@digitaldynamics-group.com';
  const text = [
    `Hi ${first},`, '',
    'Thank you. We have received your enquiry and a real person will read it.',
    'We will reply to this address with a fixed, written quote or a few short questions. We work in writing, so there is no call to book.', '',
    'What you sent us:', ...lines.map((l) => `- ${l}`), '',
    `If anything above is wrong, or you want to add something, reply to this email or write to ${contact}.`, '',
    'Digital Dynamics Group Pty Ltd', 'ABN 66 687 743 193 · Brisbane, Queensland', 'PO Box 2070, Brighton Eventide QLD 4017', 'https://ddg.limited',
  ].join('\n');
  const html = `<!doctype html><html><body style="margin:0;padding:0;background:#0b0f16;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0f16;padding:32px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#141821;">
<tr><td style="background:#0b0f16;padding:22px 28px;color:#ffffff;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Digital Dynamics Group</td></tr>
<tr><td style="padding:30px 28px 8px;"><h1 style="margin:0 0 14px;font-size:22px;font-weight:600;">Thank you, ${esc(first)}. We have your enquiry.</h1>
<p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#3a4252;">A real person will read it. We will reply to this address with a fixed, written quote or a few short questions. We work in writing, so there is no call to book.</p></td></tr>
<tr><td style="padding:8px 28px 6px;"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#6b7487;">What you sent us</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5f9;border-radius:12px;"><tr><td style="padding:14px 18px;font-size:15px;line-height:1.6;color:#141821;">${lines.map((l) => esc(l)).join('<br>')}</td></tr></table></td></tr>
<tr><td style="padding:18px 28px 28px;"><p style="margin:0;font-size:15px;line-height:1.55;color:#3a4252;">If anything is wrong, or you want to add something, reply to this email or write to <a href="mailto:${contact}" style="color:#1c6fa3;">${contact}</a>.</p></td></tr>
<tr><td style="border-top:1px solid #e6e9ef;padding:18px 28px 24px;font-size:12px;line-height:1.6;color:#6b7487;">Digital Dynamics Group Pty Ltd · ABN 66 687 743 193 · Brisbane, Queensland<br>PO Box 2070, Brighton Eventide QLD 4017 · <a href="https://ddg.limited" style="color:#6b7487;">ddg.limited</a><br>You are getting this email because this address was entered in the enquiry form on ddg.limited. We have not added you to any mailing list.</td></tr>
</table></td></tr></table></body></html>`;
  try {
    await nodemailer.createTransport(url).sendMail({ from, to, replyTo: contact, subject: 'We have your enquiry · Digital Dynamics Group', text, html });
    note(true);
    return true;
  } catch (err) {
    note(false);
    logger.error({ err: err instanceof Error ? err.message : String(err) }, 'enquiry confirmation email failed');
    return false;
  }
}
