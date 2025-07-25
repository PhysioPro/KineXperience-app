import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore certain warnings or log them
        console.warn('⚠️ Vite build warning:', warning.message);
        warn(warning);
      },
    }
  }
});
