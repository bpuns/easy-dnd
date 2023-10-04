import { defineConfig } from 'vite'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'easy-dnd': join(__dirname, '../../build'),
    }
  }
})