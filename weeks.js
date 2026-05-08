import { kv } from '@vercel/kv';

const KEY = 'mt_prn_weeks';

export default async function handler(req, res) {
  // Allow requests from same origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const weeks = await kv.get(KEY);
      return res.status(200).json(weeks || []);
    } catch (err) {
      console.error('KV GET error:', err);
      return res.status(500).json({ error: 'Failed to load data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const weeks = req.body;
      if (!Array.isArray(weeks)) {
        return res.status(400).json({ error: 'Body must be an array' });
      }
      await kv.set(KEY, weeks);
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('KV SET error:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
