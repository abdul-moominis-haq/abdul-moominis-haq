import './loadEnv.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_API_URL || 'http://localhost:3000';

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function authEmailContent(payload) {
  const { user, eventData } = payload;
  const type = payload.event_type === 'send.otp'
    ? eventData?.otp_type
    : eventData?.link_type;
  const greeting = typeof user.name === 'string' && user.name.trim()
    ? `Hello ${escapeHtml(user.name.trim())},`
    : 'Hello,';
  const intent = {
    'email-verification': {
      subject: 'Verify your email address',
      message: 'Use this code to verify your email address.',
    },
    'forget-password': {
      subject: 'Reset your password',
      message: 'Use this secure link to reset your password.',
    },
    'sign-in': {
      subject: 'Sign in to your portfolio account',
      message: 'Use this secure link to sign in to your portfolio account.',
    },
  }[type];

  if (!intent) throw new Error('Unsupported Neon Auth email event type');

  const expiry = typeof eventData.expires_at === 'string'
    ? new Date(eventData.expires_at)
    : null;
  const expiryText = expiry && !Number.isNaN(expiry.getTime())
    ? `This expires at ${escapeHtml(expiry.toUTCString())}.`
    : 'This code or link expires soon.';
  const content = payload.event_type === 'send.otp'
    ? `<p>${intent.message}</p><p style="font-size:32px;font-weight:700;letter-spacing:0.24em;color:#7a4217">${escapeHtml(eventData.otp_code)}</p><p>${expiryText}</p>`
    : `<p>${intent.message}</p><p><a href="${escapeHtml(eventData.link_url)}" style="display:inline-block;background:#9b5b20;color:#fff;padding:12px 18px;text-decoration:none">Continue securely</a></p><p>If the button does not work, use this link:</p><p style="overflow-wrap:anywhere">${escapeHtml(eventData.link_url)}</p><p>${expiryText}</p>`;

  return {
    subject: `${process.env.AUTH_APP_NAME?.trim() || 'Portfolio'} — ${intent.subject}`,
    html: `<div style="max-width:560px;margin:0 auto;padding:32px 24px;background:#fffdf7;color:#211d19;font-family:Arial,sans-serif;line-height:1.6"><p style="color:#9b5b20;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(process.env.AUTH_APP_NAME?.trim() || 'Portfolio')}</p><h1 style="font-size:24px;line-height:1.25">${intent.subject}</h1><p>${greeting}</p>${content}<p style="color:#615b54;font-size:13px">If you did not request this, you can ignore this email.</p></div>`,
  };
}

async function sendNeonAuthEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and FROM_EMAIL are required for Neon Auth email delivery');
  }

  const email = payload.user?.email;
  const eventId = payload.event_id;
  const eventData = payload.event_data;
  if (
    typeof email !== 'string' ||
    !email.trim() ||
    typeof eventId !== 'string' ||
    !eventId ||
    !eventData ||
    typeof eventData !== 'object'
  ) {
    throw new Error('Neon Auth email payload is missing user or event data');
  }

  if (
    payload.event_type === 'send.otp' &&
    (
      eventData.delivery_preference === 'sms' ||
      typeof eventData.otp_code !== 'string' ||
      !/^\d{6}$/.test(eventData.otp_code)
    )
  ) {
    throw new Error('Neon Auth webhook received an unsupported or invalid OTP');
  }

  if (payload.event_type === 'send.magic_link') {
    const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
    if (typeof eventData.link_url !== 'string' || !authBaseUrl) {
      throw new Error('Neon Auth magic-link payload or base URL is missing');
    }
    const link = new URL(eventData.link_url);
    const authOrigin = new URL(authBaseUrl).origin;
    if (link.protocol !== 'https:' || link.origin !== authOrigin) {
      throw new Error('Neon Auth magic link does not use the configured HTTPS auth origin');
    }
  }

  const message = authEmailContent({ ...payload, user: payload.user, eventData });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'Idempotency-Key': eventId,
    },
    body: JSON.stringify({
      from,
      to: [email.trim()],
      ...message,
    }),
    signal: AbortSignal.timeout(7000),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected Neon Auth email delivery with status ${response.status}`);
  }
}

async function sendConfirmationEmail(to, token) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not set; skipping email send');
    return null;
  }

  const confirmUrl = `${FRONTEND_URL}/newsletter/confirm?token=${token}`;

  const body = {
    from: FROM_EMAIL,
    to,
    subject: 'Confirm your subscription',
    html: `<p>Thanks for subscribing. Please confirm your subscription by clicking the link below:</p>
           <p><a href="${confirmUrl}">Confirm subscription</a></p>
           <p>If you did not request this, you can ignore this email.</p>`
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend API error: ${res.status} ${text}`);
  }

  return res.json();
}

export { sendConfirmationEmail, sendNeonAuthEmail };
