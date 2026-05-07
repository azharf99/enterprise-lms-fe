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
    // Naikkan batas peringatan ke 2000kB karena penggunaan library berat (CKEditor & Recharts)
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Konfigurasi Manual Chunking untuk membagi file JS besar
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Pisahkan library yang sangat berat ke chunk masing-masing
            if (id.includes('@ckeditor')) return 'vendor-ckeditor';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('lucide-react')) return 'vendor-icons';

            // Pisahkan ekosistem inti ke chunk sendiri
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-core';
            }

            // Sisa library node_modules lainnya
            return 'vendor-libs';
          }
        }
      }
    }
  },
})
