import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  
  const isGitHubPages = mode === 'github'
  const base = isGitHubPages ? '/portfolio-website/' : '/'
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base,
    build: {
      outDir: 'dist',
      assetsInlineLimit: 4096,
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true
    }
  }
})
