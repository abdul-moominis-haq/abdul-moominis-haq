import { query } from '../db.js';

const TABLE = 'public.meeting_requests';

const MeetingRequest = {
  async create(data) {
    const { name, email, company, meeting_type, proposed_date, duration, agenda, message, status = 'pending' } = data;
    const res = await query(
      `INSERT INTO ${TABLE} (name, email, company, meeting_type, proposed_date, duration, agenda, message, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [name, email, company ?? null, meeting_type, proposed_date, duration, agenda ?? null, message ?? null, status]
    );
    return res.rows[0];
  },

  async getById(id) {
    const res = await query(`SELECT * FROM ${TABLE} WHERE id=$1 LIMIT 1`, [id]);
    return res.rows[0] ?? null;
  },

  async list(limit = 50) {
    const res = await query(`SELECT * FROM ${TABLE} ORDER BY created_at DESC LIMIT $1`, [limit]);
    return res.rows;
  }
};

export default MeetingRequest;
