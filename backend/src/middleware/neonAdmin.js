import { createRemoteJWKSet, errors, jwtVerify } from 'jose';
import { query } from '../db.js';

let remoteJwks;
let remoteJwksUrl;

function getAuthConfig() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;
  if (!baseUrl || !jwksUrl) {
    throw new Error('NEON_AUTH_BASE_URL and NEON_AUTH_JWKS_URL must be configured');
  }

  const authUrl = new URL(baseUrl);
  const jwks = new URL(jwksUrl);
  if (
    process.env.NODE_ENV === 'production' &&
    (authUrl.protocol !== 'https:' || jwks.protocol !== 'https:')
  ) {
    throw new Error('Neon Auth URLs must use HTTPS in production');
  }

  return { issuer: authUrl.origin, jwksUrl: jwks.toString() };
}

function getRemoteJwks(url) {
  if (!remoteJwks || remoteJwksUrl !== url) {
    remoteJwksUrl = url;
    remoteJwks = createRemoteJWKSet(new URL(url));
  }
  return remoteJwks;
}

export async function requireNeonAdmin(req, res, next) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) {
    return res.status(503).json({ error: 'Project editor access is not configured' });
  }

  const authorization = req.get('authorization') ?? '';
  const token = authorization.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length).trim()
    : '';

  if (!token) {
    return res.status(401).json({ error: 'Sign in to manage projects' });
  }

  let payload;
  try {
    const { issuer, jwksUrl } = getAuthConfig();
    ({ payload } = await jwtVerify(token, getRemoteJwks(jwksUrl), {
      algorithms: ['EdDSA'],
      issuer,
      audience: issuer,
    }));
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      return res.status(401).json({ error: 'Your sign-in has expired. Please sign in again.' });
    }

    console.error('Neon Auth token verification failed:', error);
    return res.status(503).json({ error: 'Unable to verify your sign-in right now' });
  }

  if (typeof payload.sub !== 'string') {
    return res.status(401).json({ error: 'Your sign-in is invalid' });
  }

  try {
    const result = await query(
      `SELECT email, "emailVerified" AS email_verified
       FROM neon_auth."user"
       WHERE id = $1
       LIMIT 1`,
      [payload.sub]
    );
    const user = result.rows[0];

    if (
      !user ||
      !user.email_verified ||
      typeof user.email !== 'string' ||
      user.email.trim().toLowerCase() !== adminEmail
    ) {
      return res.status(403).json({ error: 'This account is not authorized to manage projects' });
    }

    req.projectAdmin = { id: payload.sub, email: user.email };
    return next();
  } catch (error) {
    console.error('Unable to check the project editor account:', error);
    return res.status(503).json({ error: 'Unable to verify project editor access right now' });
  }
}
