import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-compiler': {
        target: 'https://api.paiza.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-compiler/, '')
      },
      '/api': {
        target: 'http://localhost:5147',
        changeOrigin: true
      }
    }
  }
})
