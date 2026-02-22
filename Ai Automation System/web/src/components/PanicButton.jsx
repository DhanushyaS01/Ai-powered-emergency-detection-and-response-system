import { useState } from 'react'
import { sendEmergencyAlert } from '../api/emergency'

const STATUS = { idle: 'idle', locating: 'locating', sending: 'sending', success: 'success', error: 'error' }

function getPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('unsupported'))
      return
    }
    const geoTimeout = options.timeout ?? 10000
    const id = setTimeout(() => reject(new Error('timeout')), geoTimeout + 3000)
    navigator.geolocation.getCurrentPosition(
      (p) => {
        clearTimeout(id)
        resolve(p)
      },
      (e) => {
        clearTimeout(id)
        reject(e)
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? false,
        timeout: geoTimeout,
        maximumAge: options.maximumAge ?? 60000,
      }
    )
  })
}

export default function PanicButton() {
  const [status, setStatus] = useState(STATUS.idle)
  const [message, setMessage] = useState('')

  async function handlePanic() {
    setMessage('')
    setStatus(STATUS.locating)

    const isSecure = typeof window !== 'undefined' && (window.isSecureContext === true || window.location?.protocol === 'https:' || window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1')
    if (!isSecure) {
      setStatus(STATUS.error)
      setMessage('Location requires HTTPS. Open this site via https:// or run on localhost.')
      return
    }

    let lat = 0
    let lon = 0
    let locationError = null

    try {
      const pos = await getPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 })
      lat = pos.coords.latitude
      lon = pos.coords.longitude
    } catch (e) {
      try {
        const pos = await getPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 })
        lat = pos.coords.latitude
        lon = pos.coords.longitude
      } catch (e2) {
        const code = e2.code ?? e.code
        const msg = code === 1
          ? 'Location denied. Allow location in your browser or device settings and try again.'
          : code === 2
            ? 'Location unavailable. Check that location/GPS is on and try again.'
            : code === 3 || (e2.message || e.message || '').toLowerCase().includes('timeout')
              ? 'Location timed out. Sending alert without coordinates—responders can contact you for location.'
              : 'Could not get location. Sending alert without coordinates.'
        locationError = msg
        lat = 0
        lon = 0
      }
    }

    setStatus(STATUS.sending)
    const result = await sendEmergencyAlert({ latitude: lat, longitude: lon })

    if (result.ok) {
      setStatus(STATUS.success)
      setMessage(locationError ? `Alert sent. ${locationError}` : 'Emergency Alert Sent Successfully')
    } else {
      setStatus(STATUS.error)
      setMessage(result.error || 'Failed to send alert. Try again.')
    }
  }

  const isBusy = status === STATUS.locating || status === STATUS.sending

  return (
    <section id="demo" className="py-20 md:py-28 px-6 bg-emergency-card/50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
          Live Demo
        </h2>
        <p className="text-gray-400 mb-12">
          Press the button to simulate an emergency alert. Your location will be sent to the backend.
        </p>

        <div className="relative inline-block">
          <button
            type="button"
            onClick={handlePanic}
            disabled={isBusy}
            className={`
              relative w-48 h-48 rounded-full font-display font-bold text-lg text-white
              transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50
              disabled:pointer-events-none
              ${isBusy
                ? 'bg-gray-600 cursor-wait'
                : 'bg-emergency-red hover:bg-red-600 hover:scale-105 active:scale-95 shadow-2xl shadow-red-900/50 hover:shadow-red-600/40'
              }
            `}
          >
            {isBusy && (
              <span className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping-slow" />
            )}
            <span className="relative z-10">
              {isBusy ? (
                <span className="inline-flex flex-col items-center gap-2">
                  <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm">
                    {status === STATUS.locating ? 'Getting location…' : 'Sending alert…'}
                  </span>
                </span>
              ) : (
                'PANIC'
              )}
            </span>
          </button>
        </div>

        <div className="mt-8 min-h-[3rem]">
          {status === STATUS.success && (
            <p className="text-green-400 font-semibold transition-opacity duration-300">
              ✓ {message}
            </p>
          )}
          {status === STATUS.error && (
            <p className="text-amber-400 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
