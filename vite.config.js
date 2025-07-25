import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👉 solution : forcer l’inclusion des modules qui bloquent le build
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
    }
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  }
})

