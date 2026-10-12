import { createHash, randomUUID } from 'node:crypto';

const PROJECT_MEDIA_FOLDER = 'portfolio-projects';
const CONTENT_SECTIONS = new Set(['home', 'about', 'experience', 'skills']);

export class CloudinaryConfigurationError extends Error {
  constructor() {
    super('Cloudinary is not configured');
    this.name = 'CloudinaryConfigurationError';
  }
}

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigurationError();
  }

  return { cloudName, apiKey, apiSecret };
}

function signParameters(params, apiSecret) {
  const canonical = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1').update(`${canonical}${apiSecret}`).digest('hex');
}

export function createProjectUploadSignature(resourceType) {
  if (resourceType !== 'image' && resourceType !== 'video') {
    throw new TypeError('Project media must be an image or video');
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const params = {
    folder: PROJECT_MEDIA_FOLDER,
    public_id: `${PROJECT_MEDIA_FOLDER}/${randomUUID()}`,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return {
    cloudName,
    apiKey,
    resourceType,
    ...params,
    signature: signParameters(params, apiSecret),
  };
}

export function createContentUploadSignature(section, resourceType) {
  if (!CONTENT_SECTIONS.has(section)) {
    throw new TypeError('Choose a valid portfolio section');
  }
  if (!['image', 'video', 'raw'].includes(resourceType)) {
    throw new TypeError('Portfolio files must be an image, video, or document');
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const folder = `portfolio-content/${section}`;
  const params = {
    folder,
    public_id: `${folder}/${randomUUID()}`,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return {
    cloudName,
    apiKey,
    resourceType,
    ...params,
    signature: signParameters(params, apiSecret),
  };
}

function validateProjectMedia({ mediaUrl, publicId, resourceType }) {
  if (
    typeof mediaUrl !== 'string' ||
    typeof publicId !== 'string' ||
    !publicId.startsWith(`${PROJECT_MEDIA_FOLDER}/`) ||
    !['image', 'video'].includes(resourceType)
  ) {
    throw new TypeError('Project media details are invalid');
  }

  const { cloudName } = getCloudinaryConfig();
  const url = new URL(mediaUrl);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'res.cloudinary.com' ||
    !url.pathname.startsWith(`/${cloudName}/${resourceType}/upload/`)
  ) {
    throw new TypeError('Project media must be served from the configured Cloudinary account');
  }
}

export function validateProjectMediaDetails(media) {
  validateProjectMedia(media);
  return true;
}

function validateContentMedia({ section, mediaUrl, publicId, resourceType }) {
  if (!CONTENT_SECTIONS.has(section)) {
    throw new TypeError('Choose a valid portfolio section');
  }
  const folder = `portfolio-content/${section}`;
  if (
    typeof mediaUrl !== 'string' ||
    typeof publicId !== 'string' ||
    !publicId.startsWith(`${folder}/`) ||
    !['image', 'video', 'raw'].includes(resourceType)
  ) {
    throw new TypeError('Portfolio file details are invalid');
  }

  const { cloudName } = getCloudinaryConfig();
  const url = new URL(mediaUrl);
  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'res.cloudinary.com' ||
    !url.pathname.startsWith(`/${cloudName}/${resourceType}/upload/`)
  ) {
    throw new TypeError('Portfolio files must be served from the configured Cloudinary account');
  }
}

export function validateContentMediaDetails(media) {
  validateContentMedia(media);
  return true;
}

async function destroyMedia(publicId, resourceType) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const body = new URLSearchParams({
    ...params,
    api_key: apiKey,
    signature: signParameters(params, apiSecret),
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/destroy`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary returned HTTP ${response.status} while deleting media`);
  }

  const result = await response.json();
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new Error('Cloudinary did not confirm project media deletion');
  }
}

export async function deleteProjectMedia(media) {
  const { mediaUrl, resourceType } = media;
  const resolvedPublicId = media.publicId ?? media.mediaPublicId;
  validateProjectMedia({ mediaUrl, publicId: resolvedPublicId, resourceType });
  await destroyMedia(resolvedPublicId, resourceType);
}

export async function deleteContentMedia(media) {
  validateContentMedia(media);
  await destroyMedia(media.publicId, media.resourceType);
}
