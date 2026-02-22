/**
 * Emergency alert API client.
 * Calls your backend webhook; API keys must live on the backend only.
 */

const USER_ID_KEY = 'safenow_user_id'

function getOrCreateUserId() {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = 'web_' + Math.random().toString(36).slice(2, 12)
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

/**
 * @param {{ latitude: number, longitude: number }} position
 * @returns {Promise<{ ok: boolean, data?: object, error?: string }>}
 */
export async function sendEmergencyAlert({ latitude, longitude }) {
  let endpoint = import.meta.env.VITE_EMERGENCY_API_URL
  if (!endpoint) {
    return { ok: false, error: 'Backend URL not configured. Set VITE_EMERGENCY_API_URL.' }
  }
  endpoint = endpoint.replace(/\/$/, '')

  const apiKey = import.meta.env.VITE_EMERGENCY_API_KEY
  const dId = import.meta.env.VITE_EMERGENCY_D_ID
  const automationId = import.meta.env.VITE_EMERGENCY_AUTOMATION_ID || (() => {
    try {
      const u = import.meta.env.VITE_EMERGENCY_API_URL || ''
      const m = u.match(/automations\/([^/]+)\//)
      return m ? m[1] : ''
    } catch {
      return ''
    }
  })()

  if (!automationId || !apiKey || !dId) {
    const missing = [(!automationId && 'automationId'), (!apiKey && 'apiKey'), (!dId && 'dId')].filter(Boolean).join(', ')
    return { ok: false, error: `Missing required: ${missing}. Set VITE_EMERGENCY_D_ID in .env (automationId is from the URL).` }
  }

  // In dev, use same-origin proxy to avoid CORS (proxy adds API key)
  const useProxy = import.meta.env.DEV && endpoint.includes('turbotic.com')
  if (useProxy) {
    endpoint = '/api/trigger'
  }

  const headers = { 'Content-Type': 'application/json' }
  if (apiKey && !useProxy) {
    headers['Authorization'] = `Bearer ${apiKey}`
    headers['x-api-key'] = apiKey
  }

  const payload = {
    trigger_type: 'panic',
    text: 'URGENT: Panic button pressed. User requests immediate help. Possible emergency. Location attached.',
    latitude: Number(latitude),
    longitude: Number(longitude),
    user_id: getOrCreateUserId(),
  }

  const body = {
    automationId,
    apiKey: apiKey || undefined,
    dId: dId || undefined,
    ...payload,
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      const msg = data.message || data.error || (typeof data === 'string' ? data : null) || `HTTP ${res.status}`
      return { ok: false, error: msg }
    }

    return { ok: true, data }
  } catch (err) {
    const msg = err.message || 'Network error'
    const isCors = msg.includes('Failed to fetch') || msg.includes('NetworkError')
    return {
      ok: false,
      error: isCors
        ? 'Request blocked (CORS or network). Use npm run dev so the proxy can forward to Turbotic.'
        : msg,
    }
  }
}
