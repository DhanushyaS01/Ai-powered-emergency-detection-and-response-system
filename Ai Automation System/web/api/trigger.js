/**
 * Vercel serverless function: proxies panic alert to Turbotic so the browser
 * doesn't hit CORS and the API key stays server-side.
 *
 * Set in Vercel: TURBOTIC_TRIGGER_URL, TURBOTIC_API_KEY
 * Frontend should use VITE_EMERGENCY_API_URL = https://your-domain.vercel.app/api/trigger
 */

const TURBOTIC_URL = process.env.TURBOTIC_TRIGGER_URL || process.env.VITE_EMERGENCY_API_URL
const TURBOTIC_KEY = process.env.TURBOTIC_API_KEY || process.env.VITE_EMERGENCY_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!TURBOTIC_URL || !TURBOTIC_KEY) {
    return res.status(500).json({ error: 'Server missing TURBOTIC_TRIGGER_URL or TURBOTIC_API_KEY' })
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TURBOTIC_KEY}`,
    'x-api-key': TURBOTIC_KEY,
  }

  try {
    const forward = await fetch(TURBOTIC_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body || {}),
    })
    const data = await forward.json().catch(() => ({}))
    res.status(forward.status).json(forward.ok ? data : { error: data.message || data.error || `Upstream ${forward.status}` })
  } catch (e) {
    res.status(502).json({ error: e.message || 'Proxy error' })
  }
}
