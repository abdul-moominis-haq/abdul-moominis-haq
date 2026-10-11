import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';
import Notification from './models/notification.js';
import Newsletter from './models/newsletter.js';
import AppModel from './models/appModel.js';
import { sendConfirmationEmail } from './mailer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'portfolio-backend' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, company, project, budget, timeline, message } = req.body;

    const insertResult = await query(
      `INSERT INTO public.contact_inquiries
       (name, email, company, project, budget, timeline, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [name, email, company ?? null, project ?? null, budget ?? null, timeline ?? null, message ?? null, 'new']
    );

    res.status(201).json({ success: true, inquiryId: insertResult.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/meeting', async (req, res) => {
  try {
    const { name, email, company, meeting_type, proposed_date, duration, agenda, message } = req.body;

    const insertResult = await query(
      `INSERT INTO public.meeting_requests
       (name, email, company, meeting_type, proposed_date, duration, agenda, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [name, email, company ?? null, meeting_type, proposed_date, duration, agenda ?? null, message ?? null, 'pending']
    );

    res.status(201).json({ success: true, meetingId: insertResult.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });
    const { subscription, token } = await Newsletter.create(email);

    // Optionally send confirmation email (no-op if RESEND_API_KEY not provided)
    try {
      await sendConfirmationEmail(email, token);
    } catch (err) {
      console.error('Failed to send confirmation email:', err.message || err);
    }

    res.status(201).json({ success: true, id: subscription.id, confirmed: subscription.confirmed });
  } catch (error) {
    console.error('Newsletter error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/newsletter/confirm', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: 'token required' });

    const sub = await Newsletter.confirmByToken(token);
    if (!sub) return res.status(404).json({ success: false, error: 'Invalid or expired token' });

    res.json({ success: true, id: sub.id, email: sub.email });
  } catch (err) {
    console.error('Confirm error', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;
