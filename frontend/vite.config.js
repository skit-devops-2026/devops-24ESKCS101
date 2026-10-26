import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The proxy forwards "/api" and "/uploads" requests from the React dev server (port 5173)
// to the Express backend (port 5001). This way React can simply call "/api/books".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:5001',
      '/uploads': 'http://127.0.0.1:5001',
    },
  },
});
