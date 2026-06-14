import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : '')).replace(
    /\/$/,
    '',
  )

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
    build: {
      sourcemap: false,
    },
  }
})
