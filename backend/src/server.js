import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 4000;

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

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
