import { query } from '../db.js';
import crypto from 'node:crypto';

const TABLE = 'public.newsletter_subscriptions';

const Newsletter = {
  async create(email) {
    const token = crypto.randomBytes(20).toString('hex');
    // Upsert: if exists and unsubscribed false, return existing; otherwise insert or update token
    const res = await query(
      `INSERT INTO ${TABLE} (email, confirmation_token)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET confirmation_token = EXCLUDED.confirmation_token, unsubscribed = false
       RETURNING *`,
      [email, token]
    );
    return { subscription: res.rows[0], token };
  },

  async confirmByToken(token) {
    const res = await query(
      `UPDATE ${TABLE} SET confirmed = true, confirmed_at = now(), confirmation_token = NULL
       WHERE confirmation_token = $1 AND confirmed = false
       RETURNING *`,
      [token]
    );
    return res.rows[0] ?? null;
  },

  async getByEmail(email) {
    const res = await query(`SELECT * FROM ${TABLE} WHERE email=$1 LIMIT 1`, [email]);
    return res.rows[0] ?? null;
  },

  async list(limit = 100) {
    const res = await query(`SELECT * FROM ${TABLE} ORDER BY created_at DESC LIMIT $1`, [limit]);
    return res.rows;
  }
};

export default Newsletter;
