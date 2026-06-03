import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Forces file scanning inside Docker containers
    },
    host: true, // Needed to expose the port out of Docker
    port: 5173,
  },
})
