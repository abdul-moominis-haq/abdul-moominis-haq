import assert from 'node:assert/strict';
import { createHash, sign as signDetachedJws } from 'node:crypto';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import { Pool } from 'pg';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';

const authOrigin = 'https://auth.example.test';
const projectId = '4eb3d2f8-3924-4fcb-a341-2b66de5b67a9';
const insertedProject = {
  id: projectId,
  slug: 'new-project',
  title: 'New project',
  description: 'A test portfolio record.',
  mediaUrl: 'https://res.cloudinary.com/demo/image/upload/v1/portfolio-projects/test',
  mediaPublicId: 'portfolio-projects/test',
  mediaType: 'image',
  githubUrl: 'https://github.com/example/new-project',
  hostedUrl: null,
  year: '',
  role: '',
  category: '',
  technologies: [],
  position: 6,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};
const seededProject = {
  ...insertedProject,
  id: 'b38e4543-03aa-4c08-aeaa-e0464e53c97e',
  slug: 'smartagri',
  title: 'SmartAgri – Smart Farming Management System',
  description: 'Digital agriculture platform for farmers.',
  mediaUrl: null,
  mediaPublicId: null,
  mediaType: null,
  githubUrl: null,
  position: 0,
};

let apiServer;
let jwksServer;
let apiOrigin;
let adminToken;
let deniedToken;
let activeUser;
let poolConnect;
let projectQueryMock;
let webhookPrivateKey;
let projectQueryCount = 0;
let insertQueryCount = 0;
let contentDocument = {
  name: 'IS-HAQ ABDUL-MOOMIN',
  location: 'Accra, Ghana',
  discipline: 'Software engineer',
  specialties: 'Full-stack · AI · IoT',
  cvUrl: '/cv.pdf',
  portraitUrl: '',
  assets: [],
};
let contentWriteCount = 0;

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve(server.address().port);
    });
  });
}

async function signToken(privateKey, subject) {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'EdDSA', kid: 'project-test-key' })
    .setSubject(subject)
    .setIssuer(authOrigin)
    .setAudience(authOrigin)
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey);
}

async function apiRequest(path, { token, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return fetch(`${apiOrigin}${path}`, { ...options, headers });
}

function signedSignupRequest({
  email,
  timestamp = Date.now(),
  eventType = 'user.before_create',
  corruptSignature = false,
}) {
  const eventId = 'b2294441-3951-41e8-a755-e5327caa2e68';
  const rawBody = Buffer.from(JSON.stringify({
    event_id: eventId,
    event_type: eventType,
    timestamp: new Date(timestamp).toISOString(),
    context: { endpoint_id: 'test-endpoint', project_name: 'Portfolio' },
    user: { email, name: 'Portfolio Admin' },
    event_data: { auth_provider: 'credential' },
  }));
  const header = Buffer.from(JSON.stringify({
    alg: 'EdDSA',
    kid: 'project-test-key',
  })).toString('base64url');
  const payloadB64 = rawBody.toString('base64url');
  const signaturePayload = `${timestamp}.${payloadB64}`;
  const signaturePayloadB64 = Buffer.from(signaturePayload, 'utf8').toString('base64url');
  const signingInput = `${header}.${signaturePayloadB64}`;
  const signature = signDetachedJws(
    null,
    Buffer.from(signingInput, 'ascii'),
    webhookPrivateKey,
  ).toString('base64url');
  const suppliedSignature = corruptSignature
    ? `${signature.startsWith('A') ? 'B' : 'A'}${signature.slice(1)}`
    : signature;

  return apiRequest('/api/webhooks/neon-auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Neon-Signature': `${header}..${suppliedSignature}`,
      'X-Neon-Signature-Kid': 'project-test-key',
      'X-Neon-Timestamp': String(timestamp),
      'X-Neon-Event-Type': eventType,
      'X-Neon-Event-Id': eventId,
    },
    body: rawBody,
  });
}

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.ADMIN_EMAIL = 'admin@example.test';
  process.env.NEON_AUTH_BASE_URL = `${authOrigin}/portfolio/auth`;
  process.env.CLOUDINARY_CLOUD_NAME = 'demo';
  process.env.CLOUDINARY_API_KEY = 'test-api-key';
  process.env.CLOUDINARY_API_SECRET = 'test-cloudinary-secret';

  const { privateKey, publicKey } = await generateKeyPair('EdDSA');
  webhookPrivateKey = privateKey;
  const jwk = await exportJWK(publicKey);
  Object.assign(jwk, { kid: 'project-test-key', alg: 'EdDSA', use: 'sig' });
  jwksServer = createServer((_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.end(JSON.stringify({ keys: [jwk] }));
  });
  const jwksPort = await listen(jwksServer);
  process.env.NEON_AUTH_JWKS_URL = `http://127.0.0.1:${jwksPort}/.well-known/jwks.json`;

  adminToken = await signToken(privateKey, 'user-admin');
  deniedToken = await signToken(privateKey, 'user-other');
  activeUser = { email: 'admin@example.test', email_verified: true };

  poolConnect = Pool.prototype.connect;
  projectQueryMock = async function queryMock(statement, values) {
    const sql = String(statement);
    if (sql.includes('FROM neon_auth."user"')) {
      const user = values[0] === 'user-admin'
        ? activeUser
        : { email: 'other@example.test', email_verified: true };
      return { rows: user ? [{ ...user }] : [], rowCount: user ? 1 : 0 };
    }
    if (sql.startsWith('SELECT section, document, updated_at')) {
      return {
        rows: [{ section: 'home', document: contentDocument, updatedAt: '2026-01-01T00:00:00.000Z' }],
        rowCount: 1,
      };
    }
    if (sql.startsWith('SELECT section, document FROM public.portfolio_content')) {
      return { rows: [{ section: 'home', document: contentDocument }], rowCount: 1 };
    }
    if (sql.startsWith('INSERT INTO public.portfolio_content')) {
      contentWriteCount += 1;
      contentDocument = JSON.parse(values[1]);
      return {
        rows: [{ section: values[0], document: contentDocument, updatedAt: '2026-01-01T00:00:00.000Z' }],
        rowCount: 1,
      };
    }
    if (sql.startsWith('DELETE FROM public.portfolio_content')) {
      contentWriteCount += 1;
      return { rows: [], rowCount: 1 };
    }
    if (sql.startsWith('INSERT INTO public.portfolio_projects')) {
      insertQueryCount += 1;
      return { rows: [insertedProject], rowCount: 1 };
    }
    if (sql.startsWith('SELECT media_url AS "mediaUrl"')) {
      return {
        rows: [{ mediaUrl: null, mediaPublicId: null, mediaType: null }],
        rowCount: 1,
      };
    }
    if (sql.startsWith('UPDATE public.portfolio_projects')) {
      return { rows: [{ ...insertedProject, title: 'Updated project' }], rowCount: 1 };
    }
    if (sql.startsWith('DELETE FROM public.portfolio_projects')) {
      return {
        rows: [{ mediaUrl: null, mediaPublicId: null, mediaType: null }],
        rowCount: 1,
      };
    }
    if (sql.includes('FROM public.portfolio_projects')) {
      projectQueryCount += 1;
      return { rows: [seededProject], rowCount: 1 };
    }
    throw new Error(`Unexpected SQL in project API test: ${sql}`);
  };
  Pool.prototype.connect = async function connectMock() {
    return { query: projectQueryMock, release() {} };
  };

  const { default: app } = await import('../src/app.js');
  apiServer = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    apiServer.once('error', reject);
    apiServer.once('listening', resolve);
  });
  apiOrigin = `http://127.0.0.1:${apiServer.address().port}`;
});

after(async () => {
  if (apiServer) {
    apiServer.closeAllConnections();
    await new Promise((resolve) => apiServer.close(resolve));
  }
  if (jwksServer) {
    jwksServer.closeAllConnections();
    await new Promise((resolve) => jwksServer.close(resolve));
  }
  if (poolConnect) Pool.prototype.connect = poolConnect;
});

test('public reads, admin authorization, and project CRUD endpoints', async () => {
  const allowedSignup = await signedSignupRequest({
    email: 'ADMIN@example.test',
  });
  assert.equal(allowedSignup.status, 200);
  assert.deepEqual(await allowedSignup.json(), { allowed: true });

  const blockedSignup = await signedSignupRequest({
    email: 'visitor@example.test',
  });
  assert.equal(blockedSignup.status, 200);
  assert.deepEqual(await blockedSignup.json(), {
    allowed: false,
    error_message: 'Sign-up is restricted to the configured portfolio administrator.',
    error_code: 'ADMIN_EMAIL_REQUIRED',
  });

  const forgedSignup = await signedSignupRequest({
    email: 'admin@example.test',
    corruptSignature: true,
  });
  assert.equal(forgedSignup.status, 401);

  const staleSignup = await signedSignupRequest({
    email: 'admin@example.test',
    timestamp: Date.now() - 6 * 60 * 1000,
  });
  assert.equal(staleSignup.status, 401);

  const mismatchedEvent = await signedSignupRequest({
    email: 'admin@example.test',
    eventType: 'user.created',
  });
  assert.equal(mismatchedEvent.status, 400);

  const publicContent = await apiRequest('/api/content');
  assert.equal(publicContent.status, 200);
  assert.equal((await publicContent.json()).home.name, 'IS-HAQ ABDUL-MOOMIN');

  const unauthenticatedContent = await apiRequest('/api/content/manage');
  assert.equal(unauthenticatedContent.status, 401);

  const unauthenticatedContentWrite = await apiRequest('/api/content/home', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: contentDocument }),
  });
  assert.equal(unauthenticatedContentWrite.status, 401);

  const publicResponse = await apiRequest('/api/projects');
  assert.equal(publicResponse.status, 200);
  assert.equal((await publicResponse.json())[0].slug, 'smartagri');

  const unauthenticated = await apiRequest('/api/projects/manage');
  assert.equal(unauthenticated.status, 401);

  const invalidToken = await apiRequest('/api/projects/manage', { token: 'not-a-jwt' });
  assert.equal(invalidToken.status, 401);

  const unauthenticatedCreate = await apiRequest('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Should not save' }),
  });
  assert.equal(unauthenticatedCreate.status, 401);

  const denied = await apiRequest('/api/projects/manage', { token: deniedToken });
  assert.equal(denied.status, 403);

  activeUser = { email: 'admin@example.test', email_verified: false };
  const unverified = await apiRequest('/api/projects/manage', { token: adminToken });
  assert.equal(unverified.status, 403);
  activeUser = { email: 'admin@example.test', email_verified: true };

  const managed = await apiRequest('/api/projects/manage', { token: adminToken });
  assert.equal(managed.status, 200);
  assert.equal((await managed.json()).projects.length, 1);

  const managedContent = await apiRequest('/api/content/manage', { token: adminToken });
  assert.equal(managedContent.status, 200);
  assert.equal((await managedContent.json()).home.document.name, contentDocument.name);

  const invalidContentWrite = await apiRequest('/api/content/experience', {
    method: 'PUT',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: { heading: 'Missing required fields' } }),
  });
  assert.equal(invalidContentWrite.status, 400);
  assert.equal(contentWriteCount, 0);

  const contentWrite = await apiRequest('/api/content/home', {
    method: 'PUT',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: { ...contentDocument, location: 'Kumasi, Ghana' } }),
  });
  assert.equal(contentWrite.status, 200);
  assert.equal((await contentWrite.json()).document.location, 'Kumasi, Ghana');
  assert.equal(contentWriteCount, 1);

  const sectionDocuments = {
    about: {
      heading: 'About',
      intro: 'An introduction',
      narrativeTitle: 'My work',
      narrative: 'A short overview.',
      education: {
        degree: 'Degree',
        period: '',
        school: 'University',
        grade: '',
        concentrations: '',
        coursework: '',
      },
      highlights: [],
      assets: [],
    },
    experience: { heading: 'Experience', intro: 'Career history', items: [], assets: [] },
    skills: {
      heading: 'Skills',
      intro: 'Technical skills',
      categories: [],
      languages: [],
      certifications: [],
      assets: [],
    },
  };
  for (const [section, document] of Object.entries(sectionDocuments)) {
    const sectionWrite = await apiRequest(`/api/content/${section}`, {
      method: 'PUT',
      token: adminToken,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document }),
    });
    assert.equal(sectionWrite.status, 200);
    assert.equal((await sectionWrite.json()).section, section);
  }
  assert.equal(contentWriteCount, 4);

  const contentSignatureResponse = await apiRequest('/api/content/upload-signature', {
    method: 'POST',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'home', resourceType: 'raw' }),
  });
  assert.equal(contentSignatureResponse.status, 200);
  const contentSignature = await contentSignatureResponse.json();
  assert.equal(contentSignature.resourceType, 'raw');
  assert.equal(contentSignature.folder, 'portfolio-content/home');
  assert.equal('apiSecret' in contentSignature, false);

  const invalidContentSignature = await apiRequest('/api/content/upload-signature', {
    method: 'POST',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ section: 'home', resourceType: 'executable' }),
  });
  assert.equal(invalidContentSignature.status, 400);

  const contentReset = await apiRequest('/api/content/home', {
    method: 'DELETE',
    token: adminToken,
  });
  assert.equal(contentReset.status, 204);
  assert.equal(contentWriteCount, 5);

  const signatureResponse = await apiRequest('/api/projects/upload-signature', {
    method: 'POST',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resourceType: 'image' }),
  });
  assert.equal(signatureResponse.status, 200);
  const signature = await signatureResponse.json();
  assert.equal(signature.resourceType, 'image');
  assert.equal(signature.folder, 'portfolio-projects');
  assert.equal('apiSecret' in signature, false);
  const signedParams = {
    folder: signature.folder,
    public_id: signature.public_id,
    timestamp: signature.timestamp,
  };
  const expectedSignature = createHash('sha1')
    .update(
      `${Object.keys(signedParams)
        .sort()
        .map((key) => `${key}=${signedParams[key]}`)
        .join('&')}${process.env.CLOUDINARY_API_SECRET}`,
    )
    .digest('hex');
  assert.equal(signature.signature, expectedSignature);

  const invalidCreate = await apiRequest('/api/projects', {
    method: 'POST',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Invalid project',
      description: 'Missing an approved GitHub destination.',
    }),
  });
  assert.equal(invalidCreate.status, 400);
  assert.equal(insertQueryCount, 0);

  const createResponse = await apiRequest('/api/projects', {
    method: 'POST',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: insertedProject.title,
      description: insertedProject.description,
      mediaUrl: insertedProject.mediaUrl,
      mediaPublicId: insertedProject.mediaPublicId,
      mediaType: insertedProject.mediaType,
      githubUrl: insertedProject.githubUrl,
      hostedUrl: '',
    }),
  });
  assert.equal(createResponse.status, 201);
  assert.equal((await createResponse.json()).slug, 'new-project');
  assert.equal(insertQueryCount, 1);

  const malformedId = await apiRequest('/api/projects/not-a-uuid', {
    method: 'PUT',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(malformedId.status, 400);

  const malformedDeleteId = await apiRequest('/api/projects/not-a-uuid', {
    method: 'DELETE',
    token: adminToken,
  });
  assert.equal(malformedDeleteId.status, 400);

  const updateResponse = await apiRequest(`/api/projects/${projectId}`, {
    method: 'PUT',
    token: adminToken,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Updated project',
      description: 'Updated project description.',
      mediaUrl: insertedProject.mediaUrl,
      mediaPublicId: insertedProject.mediaPublicId,
      mediaType: insertedProject.mediaType,
      githubUrl: insertedProject.githubUrl,
      hostedUrl: '',
    }),
  });
  assert.equal(updateResponse.status, 200);
  assert.equal((await updateResponse.json()).project.title, 'Updated project');

  const deleteResponse = await apiRequest(`/api/projects/${projectId}`, {
    method: 'DELETE',
    token: adminToken,
  });
  assert.equal(deleteResponse.status, 200);
  assert.deepEqual(await deleteResponse.json(), { success: true });
  assert.ok(projectQueryCount >= 2);
});
