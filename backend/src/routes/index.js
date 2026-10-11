import { Router } from 'express';

const router = Router();

// Health
router.get('/health', (_req, res) => res.json({ ok: true }));

// Placeholder: mount other route modules here

export default router;
