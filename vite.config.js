import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), tsconfigPaths(), UnoCSS()],
  server: {
    port: 2323,
  },

  base: '',
  esbuild: {
    jsxFactory: '__h',
    jsxFragment: '__Fragment',
    jsxInject: 'import {h as __h, Fragment as __Fragment} from "vue"',
  },
  resolve: {
    alias: {
      '@/': resolve(__dirname, './src'),
    },
  },
})
