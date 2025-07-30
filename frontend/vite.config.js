import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // <--- THÊM MỤC NÀY VÀO
    host: true, // Cho phép truy cập từ network
    hmr: {
      host: 'localhost',
    },
    // Thêm dòng này để cho phép ngrok
    allowedHosts: ['03c43ea022a8.ngrok-free.app']
  }
})