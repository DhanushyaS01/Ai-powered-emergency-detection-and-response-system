import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const turboticUrl = env.VITE_EMERGENCY_API_URL
  const turboticKey = env.VITE_EMERGENCY_API_KEY
  const useProxy = turboticUrl && turboticKey && (turboticUrl.startsWith('https://turbotic.com') || turboticUrl.startsWith('http'))

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: useProxy
        ? {
            '/api/trigger': {
              target: turboticUrl.startsWith('http') ? new URL(turboticUrl).origin : 'https://turbotic.com',
              changeOrigin: true,
              secure: true,
              rewrite: () => new URL(turboticUrl).pathname,
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  if (turboticKey) {
                    proxyReq.setHeader('Authorization', `Bearer ${turboticKey}`)
                    proxyReq.setHeader('x-api-key', turboticKey)
                  }
                })
              },
            },
          }
        : undefined,
    },
  }
})
