import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Naikkan sedikit batas peringatan agar tidak terlalu sensitif
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Konfigurasi Manual Chunking
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Pisahkan CKEditor ke file vendor-ckeditor.js
            if (id.includes('@ckeditor')) {
              return 'vendor-ckeditor';
            }
            // Pisahkan ekosistem React ke file vendor-react.js
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            // Sisa library lainnya ke vendor.js
            return 'vendor';
          }
        }
      }
    }
  },
})
