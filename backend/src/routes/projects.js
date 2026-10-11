import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { requireNeonAdmin } from '../middleware/neonAdmin.js';
import {
  CloudinaryConfigurationError,
  createProjectUploadSignature,
  deleteProjectMedia,
  validateProjectMediaDetails,
} from '../services/cloudinary.js';

const router = Router();
const projectIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const projectColumns = `
  id,
  slug,
  title,
  description,
  media_url AS "mediaUrl",
  media_public_id AS "mediaPublicId",
  media_type AS "mediaType",
  github_url AS "githubUrl",
  hosted_url AS "hostedUrl",
  year,
  role,
  category,
  technologies,
  position,
  created_at AS "createdAt",
  updated_at AS "updatedAt"`;

function normalizeOptionalUrl(value, fieldName, allowedHosts) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > 2048) {
    throw new TypeError(`${fieldName} must be a valid HTTPS URL`);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TypeError(`${fieldName} must be a valid HTTPS URL`);
  }

  if (url.protocol !== 'https:' || (allowedHosts && !allowedHosts.includes(url.hostname))) {
    throw new TypeError(`${fieldName} must be a valid HTTPS URL`);
  }

  return url.toString();
}

function validateProjectInput(body, { requireMedia = true } = {}) {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (!title || title.length > 160) {
    throw new TypeError('Project title is required and must be 160 characters or fewer');
  }
  if (!description || description.length > 10000) {
    throw new TypeError('Project description is required and must be 10,000 characters or fewer');
  }

  const githubUrl = normalizeOptionalUrl(body.githubUrl, 'GitHub link', ['github.com', 'www.github.com']);
  if (!githubUrl) throw new TypeError('GitHub link is required');

  const hostedUrl = normalizeOptionalUrl(body.hostedUrl, 'Hosted link');
  const media = {
    mediaUrl: body.mediaUrl || null,
    publicId: body.mediaPublicId || null,
    resourceType: body.mediaType || null,
  };

  if (requireMedia || media.mediaUrl || media.publicId || media.resourceType) {
    validateProjectMediaDetails(media);
  }

  const technologies = body.technologies ?? [];
  if (
    !Array.isArray(technologies) ||
    technologies.length > 20 ||
    technologies.some((technology) => typeof technology !== 'string' || technology.trim().length > 50)
  ) {
    throw new TypeError('Technologies must be a list of up to 20 labels');
  }

  const optionalText = (value, field, maxLength) => {
    if (value === undefined || value === null || value === '') return '';
    if (typeof value !== 'string' || value.trim().length > maxLength) {
      throw new TypeError(`${field} must be ${maxLength} characters or fewer`);
    }
    return value.trim();
  };

  return {
    title,
    description,
    media,
    githubUrl,
    hostedUrl,
    year: optionalText(body.year, 'Year', 20),
    role: optionalText(body.role, 'Role', 120),
    category: optionalText(body.category, 'Category', 80),
    technologies: technologies.map((technology) => technology.trim()).filter(Boolean),
  };
}

function slugify(value) {
  const slug = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || `project-${randomUUID()}`;
}

function isUniqueViolation(error) {
  return error?.code === '23505';
}

function serverError(res, operation, error) {
  console.error(`Project ${operation} failed:`, error);
  return res.status(500).json({ error: `Unable to ${operation} project right now` });
}

router.get('/', async (_req, res) => {
  try {
    const result = await query(
      `SELECT ${projectColumns}
       FROM public.portfolio_projects
       ORDER BY position ASC, created_at ASC`
    );
    return res.json(result.rows);
  } catch (error) {
    return serverError(res, 'load', error);
  }
});

router.get('/manage', requireNeonAdmin, async (_req, res) => {
  try {
    const result = await query(
      `SELECT ${projectColumns}
       FROM public.portfolio_projects
       ORDER BY position ASC, created_at ASC`
    );
    return res.json({ projects: result.rows });
  } catch (error) {
    return serverError(res, 'load', error);
  }
});

router.post('/upload-signature', requireNeonAdmin, (req, res) => {
  try {
    const { resourceType } = req.body ?? {};
    return res.json(createProjectUploadSignature(resourceType));
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) {
      return res.status(400).json({ error: error.message });
    }
    return serverError(res, 'prepare media upload for', error);
  }
});

router.delete('/media', requireNeonAdmin, async (req, res) => {
  try {
    const media = {
      mediaUrl: req.body?.mediaUrl,
      publicId: req.body?.mediaPublicId,
      resourceType: req.body?.mediaType,
    };
    validateProjectMediaDetails(media);
    await deleteProjectMedia(media);
    return res.status(204).end();
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) {
      return res.status(400).json({ error: error.message });
    }
    return serverError(res, 'delete uploaded media for', error);
  }
});

router.post('/', requireNeonAdmin, async (req, res) => {
  let project;
  try {
    project = validateProjectInput(req.body ?? {});
    const id = randomUUID();
    const result = await query(
      `INSERT INTO public.portfolio_projects
         (id, slug, title, description, media_url, media_public_id, media_type,
          github_url, hosted_url, year, role, category, technologies, position)
       SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
              COALESCE(MAX(position), -1) + 1
       FROM public.portfolio_projects
       RETURNING ${projectColumns}`,
      [
        id,
        slugify(project.title),
        project.title,
        project.description,
        project.media.mediaUrl,
        project.media.publicId,
        project.media.resourceType,
        project.githubUrl,
        project.hostedUrl,
        project.year,
        project.role,
        project.category,
        project.technologies,
      ]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) return res.status(400).json({ error: error.message });
    if (isUniqueViolation(error)) {
      return res.status(409).json({ error: 'A project with a matching title already exists' });
    }
    return serverError(res, 'create', error);
  }
});

router.put('/:id', requireNeonAdmin, async (req, res) => {
  if (!projectIdPattern.test(req.params.id)) {
    return res.status(400).json({ error: 'Project id must be a valid UUID' });
  }

  let project;
  let previous;
  try {
    project = validateProjectInput(req.body ?? {});
    const current = await query(
      `SELECT media_url AS "mediaUrl",
              media_public_id AS "mediaPublicId",
              media_type AS "mediaType"
       FROM public.portfolio_projects
       WHERE id = $1
       LIMIT 1`,
      [req.params.id]
    );
    previous = current.rows[0];
    if (!previous) return res.status(404).json({ error: 'Project not found' });

    const result = await query(
      `UPDATE public.portfolio_projects
       SET slug = $2,
           title = $3,
           description = $4,
           media_url = $5,
           media_public_id = $6,
           media_type = $7,
           github_url = $8,
           hosted_url = $9,
           year = $10,
           role = $11,
           category = $12,
           technologies = $13
       WHERE id = $1
       RETURNING ${projectColumns}`,
      [
        req.params.id,
        slugify(project.title),
        project.title,
        project.description,
        project.media.mediaUrl,
        project.media.publicId,
        project.media.resourceType,
        project.githubUrl,
        project.hostedUrl,
        project.year,
        project.role,
        project.category,
        project.technologies,
      ]
    );

    const updated = result.rows[0];
    const mediaChanged =
      previous.mediaPublicId !== updated.mediaPublicId && previous.mediaPublicId;
    let warning;
    if (mediaChanged) {
      try {
        await deleteProjectMedia(previous);
      } catch (error) {
        console.error('Unable to clean up replaced project media:', error);
        warning = 'Project saved, but the previous media could not be removed from Cloudinary.';
      }
    }
    return res.json({ project: updated, warning });
  } catch (error) {
    if (error instanceof CloudinaryConfigurationError) {
      return res.status(503).json({ error: 'Cloudinary media storage is not configured' });
    }
    if (error instanceof TypeError) return res.status(400).json({ error: error.message });
    if (isUniqueViolation(error)) {
      return res.status(409).json({ error: 'A project with a matching title already exists' });
    }
    return serverError(res, 'update', error);
  }
});

router.delete('/:id', requireNeonAdmin, async (req, res) => {
  if (!projectIdPattern.test(req.params.id)) {
    return res.status(400).json({ error: 'Project id must be a valid UUID' });
  }

  try {
    const result = await query(
      `DELETE FROM public.portfolio_projects
       WHERE id = $1
       RETURNING media_url AS "mediaUrl",
                 media_public_id AS "mediaPublicId",
                 media_type AS "mediaType"`,
      [req.params.id]
    );
    const project = result.rows[0];
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let warning;
    if (project.mediaUrl) {
      try {
        await deleteProjectMedia(project);
      } catch (error) {
        console.error('Unable to clean up deleted project media:', error);
        warning = 'Project deleted, but its media could not be removed from Cloudinary.';
      }
    }

    return res.json({ success: true, warning });
  } catch (error) {
    return serverError(res, 'delete', error);
  }
});

export default router;
