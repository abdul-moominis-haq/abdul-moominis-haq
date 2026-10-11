import { query } from '../db.js';

const TABLE = 'public.contact_inquiries';

const ContactInquiry = {
  async create(data) {
    const { name, email, company, project, budget, timeline, message, status = 'new' } = data;
    const res = await query(
      `INSERT INTO ${TABLE} (name, email, company, project, budget, timeline, message, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [name, email, company ?? null, project ?? null, budget ?? null, timeline ?? null, message ?? null, status]
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

export default ContactInquiry;
