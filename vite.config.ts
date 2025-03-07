import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  
  const isGitHubPages = mode === 'github'
  
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    base: isGitHubPages ? '/portfolio-website/' : '/',
    build: {
      outDir: 'dist',
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true
    }
  }
})
