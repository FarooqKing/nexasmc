import { NextRequest, NextResponse } from 'next/server';
import { createMailTransporter, isMailConfigured, mailConfig } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const rateLimit = new Map<string, number>();
const RATE_LIMIT_MS = 20_000;

function clean(value: FormDataEntryValue | null): string {
  return typeof value === 'string' ? value.trim() : '';
}

function htmlEncode(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    const lastRequestAt = rateLimit.get(ip) || 0;
    const now = Date.now();

    if (now - lastRequestAt < RATE_LIMIT_MS) {
      return NextResponse.json(
        { ok: false, message: 'Please wait a few seconds before sending another message.' },
        { status: 429 }
      );
    }

    const form = await request.formData();

    // Honeypot. Normal visitors do not fill this field.
    if (clean(form.get('Website'))) {
      return NextResponse.json({ ok: true, message: 'Thank you. Your message has been received.' });
    }

    const name = clean(form.get('Name'));
    const email = clean(form.get('Email'));
    const phone = clean(form.get('Phone'));
    const subject = clean(form.get('Subject'));
    const message = clean(form.get('Message'));

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !message || !validEmail) {
      return NextResponse.json(
        { ok: false, message: 'Please complete the required fields with a valid email address.' },
        { status: 422 }
      );
    }

    if (
      name.length > 120 ||
      email.length > 200 ||
      phone.length > 80 ||
      subject.length > 200 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { ok: false, message: 'One or more fields are longer than allowed.' },
        { status: 422 }
      );
    }

    if ([name, email, subject].some((value) => /[\r\n]/.test(value))) {
      return NextResponse.json({ ok: false, message: 'Invalid form data.' }, { status: 422 });
    }

    if (!isMailConfigured()) {
      console.error('nexaSMC contact email is not configured: NEXA_SMTP_PASSWORD is missing.');
      return NextResponse.json(
        { ok: false, message: 'Email is not configured yet. Please email info@nexasmc.com directly.' },
        { status: 503 }
      );
    }

    const safeName = htmlEncode(name);
    const safeEmail = htmlEncode(email);
    const safePhone = htmlEncode(phone);
    const safeSubject = htmlEncode(subject);
    const safeMessage = htmlEncode(message).replace(/\r?\n/g, '<br />');
    const mailSubject = `Website Enquiry: ${subject || 'Contact Form Message'}`.slice(0, 220);
    const logoUrl = `${mailConfig.siteUrl}/assets/brand/nexa-logo-email.png`;

    const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fb;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
        <tr><td style="padding:22px 26px;background:#1d1435;color:#fff;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
            <td style="width:72px;vertical-align:middle;"><img src="${logoUrl}" width="58" height="58" alt="nexaSMC" style="display:block;width:58px;height:58px;border-radius:50%;" /></td>
            <td style="vertical-align:middle;"><div style="font-size:22px;font-weight:700;">New Website Enquiry</div>
            <div style="margin-top:5px;color:#c7d2fe;font-size:13px;">Submitted through the nexaSMC contact form</div></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:26px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.6;">
            <tr><td style="padding:7px 0;color:#64748b;width:105px;">Name</td><td style="padding:7px 0;font-weight:600;">${safeName}</td></tr>
            <tr><td style="padding:7px 0;color:#64748b;">Email</td><td style="padding:7px 0;font-weight:600;">${safeEmail}</td></tr>
            ${safePhone ? `<tr><td style="padding:7px 0;color:#64748b;">Phone</td><td style="padding:7px 0;font-weight:600;">${safePhone}</td></tr>` : ''}
            ${safeSubject ? `<tr><td style="padding:7px 0;color:#64748b;">Subject</td><td style="padding:7px 0;font-weight:600;">${safeSubject}</td></tr>` : ''}
          </table>
          <div style="height:1px;background:#e2e8f0;margin:18px 0;"></div>
          <div style="font-size:12px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">Message</div>
          <div style="font-size:15px;line-height:1.7;background:#f8fafc;border:1px solid #e7edf5;border-radius:12px;padding:16px;color:#334155;">${safeMessage}</div>
          <div style="margin-top:20px;font-size:13px;color:#0f766e;">Reply to this email to respond directly to the visitor.</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const transporter = createMailTransporter();
    await transporter.sendMail({
      from: { name: mailConfig.fromName, address: mailConfig.fromEmail },
      to: mailConfig.toEmail,
      replyTo: { name, address: email },
      subject: mailSubject,
      text: [
        'New Website Enquiry',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : '',
        subject ? `Subject: ${subject}` : '',
        '',
        'Message:',
        message,
        '',
        'Reply to this email to respond directly to the visitor.'
      ].filter(Boolean).join('\n'),
      html
    });

    rateLimit.set(ip, now);
    return NextResponse.json({ ok: true, message: 'Thank you. Your message has been sent successfully.' });
  } catch (error) {
    console.error('nexaSMC contact email failed:', error);
    return NextResponse.json(
      { ok: false, message: 'We could not send your message right now. Please email info@nexasmc.com directly.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ ok: false, message: 'Method not allowed.' }, { status: 405 });
}
