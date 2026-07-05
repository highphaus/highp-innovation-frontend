import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true // 🌟 Pro-tip: Allows testing your storefront layout profiles on mobile screens over local Wi-Fi!
  }
})