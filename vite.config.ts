import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-pageflip': fileURLToPath(new URL('../react-pageflip/src/index.ts', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
})
