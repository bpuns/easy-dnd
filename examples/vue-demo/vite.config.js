import { defineConfig } from 'vite'
import { join } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  server: {
    hmr: false
  },
  plugins: [ vue(), vueJsx() ],
  resolve: {
    alias: {
      'easy-dnd': join(__dirname, '../../build')
    }
  }
})