import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.VITE_API_URL || 'http://localhost:3000';

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

export { sendConfirmationEmail };
