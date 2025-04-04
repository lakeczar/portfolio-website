import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

const ReactCompilerConfig = {/* ... */ };

// https://vite.dev/config/
export default defineConfig(() => {
  
  return {
    plugins: [
      TanStackRouterVite({ 
        target: 'react', 
        // Added code splitting to prevent delay in loading router component outlet
        autoCodeSplitting: false 
      }),
      tailwindcss(),
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler", ReactCompilerConfig],
          ],
        },
      }),
    ],
    base: '/',
    build: {
      outDir: 'dist',
      assetsInlineLimit: 4096,
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.test.{ts,tsx}',
          '**/*.stories.{ts,tsx}',
        ],
      },
    },
  }
})
