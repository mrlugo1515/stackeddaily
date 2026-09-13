// api/track.js — Vercel Serverless Function
// Receives sale/download events from the browser and logs them
// to a Google Sheet via Apps Script Web App URL.
// No secrets needed — the Apps Script URL is the only key.

export default async function handler(req, res) {
  // CORS — allow requests from stackeddaily.org only
  res.setHeader('Access-Control-Allow-Origin', 'https://www.stackeddaily.org');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SHEET_URL = process.env.GOOGLE_SHEET_URL;
  if (!SHEET_URL) return res.status(500).json({ error: 'Sheet URL not configured' });

  try {
    const body = req.body;
    // Attach server-side timestamp and IP (for dedup)
    const payload = {
      ...body,
      serverTime: new Date().toISOString(),
      ip: req.headers['x-forwarded-for']?.split(',')[0] || 'unknown',
    };

    const response = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Sheet responded ${response.status}`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('track error:', err);
    return res.status(500).json({ error: err.message });
  }
}
