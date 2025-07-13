import jwt from 'jsonwebtoken';
import { db } from './utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT id, username, balance, created_at FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
