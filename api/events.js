// api/events.js — returns all logged events to the admin dashboard
// Events are stored in the Google Sheet; this reads them back.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const SHEET_URL = process.env.GOOGLE_SHEET_URL;

  // If no sheet URL yet, return empty (dashboard shows empty state gracefully)
  if (!SHEET_URL) {
    return res.status(200).json({ events: [] });
  }

  try {
    // Append ?read=1 so the Apps Script returns stored rows as JSON
    const response = await fetch(SHEET_URL + '?read=1');
    if (!response.ok) throw new Error(`Sheet responded ${response.status}`);
    const data = await response.json();
    return res.status(200).json({ events: Array.isArray(data) ? data : [] });
  } catch (err) {
    console.error('events read error:', err);
    return res.status(200).json({ events: [] }); // fail gracefully
  }
}
