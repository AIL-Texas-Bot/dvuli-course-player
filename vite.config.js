import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  },
  build: {
    assetsInlineLimit: 0,   // don't inline the big JSON
    chunkSizeWarningLimit: 5000,
  },
})
