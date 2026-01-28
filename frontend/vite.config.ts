import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections in Docker
    port: 5173,
    watch: {
      usePolling: true, // Enable polling for file changes in Docker
    },
    proxy: {
      '/api': {
        // Use host.docker.internal to access services on the host machine
        // If API Gateway is also in Docker, use the service name instead
        target: process.env.VITE_API_URL || 'http://host.docker.internal:3000',
        changeOrigin: true,
      },
    },
  },
})
