# SafeNow — AI Women Safety Emergency Alert (Frontend)

Modern, responsive landing page and panic-button demo for the AI-Powered Women Safety Emergency Alert System.

## Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (dark + red emergency theme)
- Mobile-first, responsive layout

## Quick start

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend integration (Turbotic + Twilio WhatsApp)

The panic button sends a **POST** request with:

| Field         | Type   | Description                          |
|---------------|--------|--------------------------------------|
| `trigger_type`| string | `"panic"`                            |
| `text`        | string | URGENT panic message (so AI flags HIGH distress) |
| `latitude`    | number | From browser Geolocation API         |
| `longitude`   | number | From browser Geolocation API         |
| `user_id`     | string | Anonymous ID (persisted in localStorage) |

### Using Turbotic

1. In `web/.env` set:
   ```env
   VITE_EMERGENCY_API_URL=https://turbotic.com/api/automations/YOUR_AUTOMATION_ID/trigger
   VITE_EMERGENCY_API_KEY=your_turbotic_api_key
   ```
2. **Always run the app with `npm run dev`** (not by opening `index.html`). The dev server proxies requests to Turbotic and adds the API key so the browser avoids CORS and the key stays server-side.
3. In your Turbotic automation, ensure **panic** always triggers WhatsApp: in the step that branches on distress, treat `trigger_type === 'panic'` as high distress (e.g. high distress if `distressLevel === 'HIGH'` **or** `trigger_type === 'panic'`). That way the Twilio WhatsApp step always runs when the panic button is used.

### Production (e.g. Vercel)

Deploy the `web/` folder to Vercel. Add env vars in the dashboard:

- `TURBOTIC_TRIGGER_URL` = your Turbotic trigger URL  
- `TURBOTIC_API_KEY` = your API key  

Set in your build env (or in the same dashboard):

- `VITE_EMERGENCY_API_URL` = `https://your-app.vercel.app/api/trigger`  

The `api/trigger.js` serverless function will forward requests to Turbotic with the key.

## Build for production

```bash
npm run build
```

Output is in `dist/`. Serve with any static host or your backend.

## Sections

- **Hero** — Headline, short description, “Activate Safety” CTA
- **Features** — AI distress detection, GPS, WhatsApp alert, AI summary
- **How It Works** — Panic → GPS → AI → Alert
- **Live Demo** — Red panic button, GPS capture, API call, success/error message
- **Impact** — Women safety, real-time response, AI for good
- **Footer** — Links and contact

## Security

- API key must **not** be exposed in the frontend.
- Frontend only calls your configured backend URL; the backend adds credentials and talks to Twilio/OpenAI/etc.
