import { query } from '../db.js';

const TABLE = 'public.notifications';

const Notification = {
  async create(data) {
    const { title, body, recipient, metadata = {} } = data;
    const res = await query(
      `INSERT INTO ${TABLE} (title, body, recipient, metadata)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [title, body, recipient ?? null, metadata]
    );
    return res.rows[0];
  },

  async list(limit = 50) {
    const res = await query(`SELECT * FROM ${TABLE} ORDER BY created_at DESC LIMIT $1`, [limit]);
    return res.rows;
  }
};

export default Notification;
