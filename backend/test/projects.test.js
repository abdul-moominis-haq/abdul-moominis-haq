import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
let projectQueryCount = 0;
let insertQueryCount = 0;

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

before(async () => {
  process.env.NODE_ENV = 'test';
  process.env.ADMIN_EMAIL = 'admin@example.test';
  process.env.NEON_AUTH_BASE_URL = `${authOrigin}/portfolio/auth`;
  process.env.CLOUDINARY_CLOUD_NAME = 'demo';
  process.env.CLOUDINARY_API_KEY = 'test-api-key';
  process.env.CLOUDINARY_API_SECRET = 'test-cloudinary-secret';

  const { privateKey, publicKey } = await generateKeyPair('EdDSA');
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
