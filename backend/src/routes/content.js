import { Router } from 'express';
import { query } from '../db.js';
import { requireNeonAdmin } from '../middleware/neonAdmin.js';
import {
  CloudinaryConfigurationError,
  createContentUploadSignature,
  deleteContentMedia,
  validateContentMediaDetails,
} from '../services/cloudinary.js';

const router = Router();
const sections = new Set(['home', 'about', 'experience', 'skills']);
const maxDocumentLength = 100_000;

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value, field, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    throw new TypeError(`${field} is required and must be ${maxLength} characters or fewer`);
  }
  return value.trim();
}

function optionalText(value, field, maxLength) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value !== 'string' || value.trim().length > maxLength) {
    throw new TypeError(`${field} must be ${maxLength} characters or fewer`);
  }
  return value.trim();
}

function textList(value, field, { maxItems = 100, maxLength = 500 } = {}) {
  if (
    !Array.isArray(value) ||
    value.length > maxItems ||
    value.some((item) => typeof item !== 'string' || !item.trim() || item.trim().length > maxLength)
  ) {
    throw new TypeError(`${field} must be a list of up to ${maxItems} non-empty text items`);
  }
  return value.map((item) => item.trim());
}

function objectList(value, field, maxItems = 100) {
  if (!Array.isArray(value) || value.length > maxItems || value.some((item) => !isRecord(item))) {
    throw new TypeError(`${field} must be a list of up to ${maxItems} records`);
  }
  return value;
}

function validateOptionalUrl(value, field) {
  const url = optionalText(value, field, 2048);
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return url;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new TypeError(`${field} must be an HTTPS URL or a site-relative path`);
  }
  if (parsed.protocol !== 'https:') {
    throw new TypeError(`${field} must be an HTTPS URL or a site-relative path`);
  }
  return parsed.toString();
}

function validateAssets(section, value) {
  const assets = value === undefined ? [] : objectList(value, 'Assets', 40);
  return assets.map((asset) => {
    const normalized = {
      label: requiredText(asset.label, 'Asset label', 100),
      mediaUrl: requiredText(asset.mediaUrl, 'Asset URL', 2048),
      mediaPublicId: requiredText(asset.mediaPublicId, 'Asset id', 255),
      mediaType: asset.mediaType,
    };
    validateContentMediaDetails({
      section,
      mediaUrl: normalized.mediaUrl,
      publicId: normalized.mediaPublicId,
      resourceType: normalized.mediaType,
    });
    return normalized;
  });
}

function validateContentDocument(section, value) {
  if (!isRecord(value)) throw new TypeError('Portfolio content must be a JSON object');
  if (JSON.stringify(value).length > maxDocumentLength) {
    throw new TypeError('Portfolio content must be smaller than 100 KB');
  }

  const assets = validateAssets(section, value.assets);
  if (section === 'home') {
    return {
      name: requiredText(value.name, 'Name', 160),
      location: requiredText(value.location, 'Location', 120),
      discipline: requiredText(value.discipline, 'Discipline', 120),
      specialties: requiredText(value.specialties, 'Specialties', 200),
      cvUrl: validateOptionalUrl(value.cvUrl, 'CV link'),
      portraitUrl: validateOptionalUrl(value.portraitUrl, 'Portrait link'),
      assets,
    };
  }

  if (section === 'about') {
    if (!isRecord(value.education)) throw new TypeError('Education must be a record');
    return {
      heading: requiredText(value.heading, 'Heading', 160),
      intro: requiredText(value.intro, 'Introduction', 2000),
      narrativeTitle: requiredText(value.narrativeTitle, 'Narrative heading', 160),
      narrative: requiredText(value.narrative, 'Narrative', 5000),
      education: {
        degree: requiredText(value.education.degree, 'Degree', 200),
        period: optionalText(value.education.period, 'Education period', 100),
        school: requiredText(value.education.school, 'School', 250),
        grade: optionalText(value.education.grade, 'Grade', 200),
        concentrations: optionalText(value.education.concentrations, 'Concentrations', 1000),
        coursework: optionalText(value.education.coursework, 'Coursework', 2000),
      },
      highlights: objectList(value.highlights, 'Highlights', 30).map((item) => ({
        title: requiredText(item.title, 'Highlight title', 160),
        description: requiredText(item.description, 'Highlight description', 1000),
      })),
      assets,
    };
  }

  if (section === 'experience') {
    return {
      heading: requiredText(value.heading, 'Heading', 160),
      intro: requiredText(value.intro, 'Introduction', 2000),
      items: objectList(value.items, 'Experience items', 100).map((item) => ({
        company: requiredText(item.company, 'Company', 160),
        role: requiredText(item.role, 'Role', 160),
        location: optionalText(item.location, 'Location', 160),
        period: requiredText(item.period, 'Period', 120),
        achievements: textList(item.achievements, 'Achievements', { maxItems: 20 }),
        tags: textList(item.tags, 'Tags', { maxItems: 30, maxLength: 80 }),
      })),
      assets,
    };
  }

  if (section === 'skills') {
    return {
      heading: requiredText(value.heading, 'Heading', 160),
      intro: requiredText(value.intro, 'Introduction', 2000),
      categories: objectList(value.categories, 'Skill categories', 50).map((item) => ({
        category: requiredText(item.category, 'Category', 160),
        skills: textList(item.skills, 'Skills', { maxItems: 60, maxLength: 100 }),
      })),
      languages: objectList(value.languages, 'Languages', 50).map((item) => ({
        name: requiredText(item.name, 'Language', 100),
        level: requiredText(item.level, 'Proficiency', 100),
      })),
      certifications: textList(value.certifications, 'Certifications', { maxItems: 100 }),
      assets,
    };
  }

  throw new TypeError('Choose a valid portfolio section');
}

function serverError(res, operation, error) {
  console.error(`Portfolio content ${operation} failed:`, error);
  return res.status(500).json({ error: `Unable to ${operation} portfolio content right now` });
}

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      'SELECT section, document FROM public.portfolio_content ORDER BY section'
    );
    return res.json(Object.fromEntries(result.rows.map(({ section, document }) => [section, document])));
  } catch (error) {
    return serverError(res, 'load', error);
  }
});

router.get('/manage', requireNeonAdmin, async (_req, res) => {
  try {
    const result = await query(
      'SELECT section, document, updated_at AS "updatedAt" FROM public.portfolio_content ORDER BY section'
    );
    return res.json(Object.fromEntries(result.rows.map(({ section, ...record }) => [section, record])));
  } catch (error) {
    return serverError(res, 'load', error);
  }
});

router.post('/upload-signature', requireNeonAdmin, (req, res) => {
  try {
    const { section, resourceType } = req.body ?? {};
    return res.json(createContentUploadSignature(section, resourceType));
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) return res.status(400).json({ error: error.message });
    return serverError(res, 'prepare upload for', error);
  }
});

router.delete('/media', requireNeonAdmin, async (req, res) => {
  try {
    const { section, mediaUrl, mediaPublicId, mediaType } = req.body ?? {};
    await deleteContentMedia({
      section,
      mediaUrl,
      publicId: mediaPublicId,
      resourceType: mediaType,
    });
    return res.status(204).end();
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) return res.status(400).json({ error: error.message });
    return serverError(res, 'delete uploaded media from', error);
  }
});

router.put('/:section', requireNeonAdmin, async (req, res) => {
  const { section } = req.params;
  if (!sections.has(section)) {
    return res.status(404).json({ error: 'Portfolio section not found' });
  }

  let document;
  try {
    document = validateContentDocument(section, req.body?.document);
    const result = await query(
      `INSERT INTO public.portfolio_content (section, document)
       VALUES ($1, $2::jsonb)
       ON CONFLICT (section)
       DO UPDATE SET document = EXCLUDED.document, updated_at = now()
       RETURNING section, document, updated_at AS "updatedAt"`,
      [section, JSON.stringify(document)]
    );
    return res.json(result.rows[0]);
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) return res.status(400).json({ error: error.message });
    return serverError(res, 'save', error);
  }
});

router.delete('/:section', requireNeonAdmin, async (req, res) => {
  if (!sections.has(req.params.section)) {
    return res.status(404).json({ error: 'Portfolio section not found' });
  }

  try {
    await query('DELETE FROM public.portfolio_content WHERE section = $1', [req.params.section]);
    return res.status(204).end();
  } catch (error) {
    return serverError(res, 'reset', error);
  }
});

export default router;
