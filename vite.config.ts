import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { seoPages } from './build/seo.ts'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Report pages live in nested folders (report/<id>/), so the build needs the absolute
  // GitHub Pages project path rather than a relative base.
  base: command === 'build' ? '/ledger_implant_osint/' : '/',
  plugins: [vue(), vueDevTools(), seoPages()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
