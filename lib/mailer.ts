import nodemailer from 'nodemailer';

function intFromEnv(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value || '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function boolFromEnv(value: string | undefined, fallback: boolean): boolean {
  if (value == null || value.trim() === '') return fallback;
  return value.trim().toLowerCase() === 'true';
}

export const mailConfig = {
  host: process.env.NEXA_SMTP_HOST || 'server390.web-hosting.com',
  port: intFromEnv(process.env.NEXA_SMTP_PORT, 465),
  secure: boolFromEnv(process.env.NEXA_SMTP_SECURE, true),
  username: process.env.NEXA_SMTP_USERNAME || 'info@nexasmc.com',
  password: process.env.NEXA_SMTP_PASSWORD || '',
  fromEmail: process.env.NEXA_SMTP_FROM_EMAIL || 'info@nexasmc.com',
  fromName: process.env.NEXA_SMTP_FROM_NAME || 'nexaSMC Website',
  toEmail: process.env.NEXA_CONTACT_TO_EMAIL || 'info@nexasmc.com',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://nexasmc.com').replace(/\/$/, '')
} as const;

export function isMailConfigured(): boolean {
  return Boolean(
    mailConfig.host &&
    mailConfig.port > 0 &&
    mailConfig.username &&
    mailConfig.password &&
    mailConfig.fromEmail &&
    mailConfig.toEmail
  );
}

/**
 * Create an SMTP transporter for one serverless request.
 *
 * Do not store the transporter in a module-level variable on Vercel. Apart
 * from avoiding stale serverless connections, returning createTransport()
 * directly also lets TypeScript preserve Nodemailer's SMTP-specific generic
 * type instead of widening it through ReturnType<typeof createTransport>.
 */
export function createMailTransporter() {
  return nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.username,
      pass: mailConfig.password
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000
  });
}
