// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // ✅ accepts all external hosts (very important)
    port: 5173,
    strictPort: true,
    cors: true,           // ✅ allows ngrok/public IP access
  },
});
