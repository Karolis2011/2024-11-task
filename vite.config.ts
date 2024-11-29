import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/frontend-task-data.json': {
        target: 'https://asmeninis.lt/',
        changeOrigin: true,
      }
    }
  }
})
