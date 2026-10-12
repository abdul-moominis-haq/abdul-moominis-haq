import express, { Router } from 'express';
import { compactVerify, createRemoteJWKSet, errors } from 'jose';
import { sendNeonAuthEmail } from '../mailer.js';

const router = Router();
const MAX_TIMESTAMP_AGE_MS = 5 * 60 * 1000;
const MAX_FUTURE_TIMESTAMP_MS = 30 * 1000;
const webhookPath = '/neon-auth';

router.use(express.raw({ type: 'application/json', limit: '32kb' }));

let remoteJwks;
let remoteJwksUrl;

class InvalidWebhookError extends Error {}

function getRemoteJwks() {
  const configuredUrl = process.env.NEON_AUTH_JWKS_URL;
  if (!configuredUrl) throw new Error('NEON_AUTH_JWKS_URL is not configured');

  const url = new URL(configuredUrl);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('NEON_AUTH_JWKS_URL must use HTTPS in production');
  }
  if (!remoteJwks || remoteJwksUrl !== url.toString()) {
    remoteJwksUrl = url.toString();
    remoteJwks = createRemoteJWKSet(url, {
      timeoutDuration: 3000,
      cooldownDuration: 3000,
    });
  }
  return remoteJwks;
}

function decodeProtectedHeader(headerSegment) {
  let header;
  try {
    header = JSON.parse(Buffer.from(headerSegment, 'base64url').toString('utf8'));
  } catch {
    throw new InvalidWebhookError('Neon Auth webhook signature header is invalid');
  }

  if (
    typeof header !== 'object' ||
    header === null ||
    header.alg !== 'EdDSA' ||
    typeof header.kid !== 'string' ||
    !header.kid
  ) {
    throw new InvalidWebhookError('Neon Auth webhook signature algorithm or key id is invalid');
  }
  return header;
}

async function verifyWebhook(rawBody, headers) {
  const signature = headers['x-neon-signature'];
  const signatureKid = headers['x-neon-signature-kid'];
  const timestamp = headers['x-neon-timestamp'];

  if (
    typeof signature !== 'string' ||
    typeof signatureKid !== 'string' ||
    typeof timestamp !== 'string' ||
    !/^\d{13}$/.test(timestamp)
  ) {
    throw new InvalidWebhookError('Neon Auth webhook signature headers are missing or invalid');
  }

  const timestampMs = Number(timestamp);
  const ageMs = Date.now() - timestampMs;
  if (ageMs > MAX_TIMESTAMP_AGE_MS || ageMs < -MAX_FUTURE_TIMESTAMP_MS) {
    throw new InvalidWebhookError('Neon Auth webhook timestamp is outside the allowed window');
  }

  const signatureParts = signature.split('.');
  if (
    signatureParts.length !== 3 ||
    !signatureParts[0] ||
    signatureParts[1] !== '' ||
    !signatureParts[2]
  ) {
    throw new InvalidWebhookError('Neon Auth webhook signature is not a detached JWS');
  }
  const [headerSegment, , signatureSegment] = signatureParts;
  const protectedHeader = decodeProtectedHeader(headerSegment);
  if (protectedHeader.kid !== signatureKid) {
    throw new InvalidWebhookError('Neon Auth webhook key id does not match its signature');
  }

  const payloadB64 = rawBody.toString('base64url');
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, 'utf8').toString('base64url');

  await compactVerify(
    `${headerSegment}.${signaturePayloadB64}.${signatureSegment}`,
    getRemoteJwks(),
    { algorithms: ['EdDSA'] },
  );

  let payload;
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    throw new InvalidWebhookError('Neon Auth webhook body must be valid JSON');
  }
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new InvalidWebhookError('Neon Auth webhook body must be a JSON object');
  }
  return payload;
}

router.post(
  webhookPath,
  (req, res, next) => {
    if (!req.is('application/json')) {
      return res.status(415).json({ error: 'Neon Auth webhooks must use application/json' });
    }
    return next();
  },
  async (req, res, next) => {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: 'Neon Auth webhook body is missing' });
    }

    let payload;
    try {
      payload = await verifyWebhook(req.body, req.headers);
    } catch (error) {
      if (error instanceof InvalidWebhookError) {
        return res.status(401).json({ error: error.message });
      }
      if (error instanceof errors.JOSEError && error.code !== 'ERR_JWKS_TIMEOUT') {
        return res.status(401).json({ error: 'Neon Auth webhook signing key is invalid' });
      }
      console.error('Unable to verify Neon Auth webhook signature:', error);
      return res.status(503).json({ error: 'Unable to verify Neon Auth webhook right now' });
    }

    const eventType = req.get('X-Neon-Event-Type');
    const eventId = req.get('X-Neon-Event-Id');
    if (
      payload.event_type !== eventType ||
      typeof eventId !== 'string' ||
      payload.event_id !== eventId
    ) {
      return res.status(400).json({ error: 'Unexpected or inconsistent Neon Auth webhook event' });
    }

    if (eventType === 'send.otp' || eventType === 'send.magic_link') {
      try {
        await sendNeonAuthEmail(payload);
        return res.status(204).end();
      } catch (error) {
        console.error('Unable to deliver Neon Auth email:', {
          eventId,
          eventType,
          message: error instanceof Error ? error.message : 'Unknown delivery error',
        });
        return res.status(502).json({ error: 'Unable to deliver Neon Auth email right now' });
      }
    }

    if (eventType !== 'user.before_create') {
      return res.status(400).json({ error: 'Unexpected Neon Auth webhook event' });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail) {
      return res.status(503).json({ error: 'Administrator sign-up is not configured' });
    }

    const email =
      typeof payload.user?.email === 'string'
        ? payload.user.email.trim().toLowerCase()
        : '';
    if (email && email === adminEmail) {
      return res.json({ allowed: true });
    }

    return res.json({
      allowed: false,
      error_message: 'Sign-up is restricted to the configured portfolio administrator.',
      error_code: 'ADMIN_EMAIL_REQUIRED',
    });
  },
);

export default router;
