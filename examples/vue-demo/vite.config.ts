import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  server: {
    hmr: false
  },
  resolve: {
    alias: {
      'easy-dnd': fileURLToPath(new URL('../../build', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
