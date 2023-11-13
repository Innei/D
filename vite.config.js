import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import tsconfigPaths from 'vite-tsconfig-paths'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [VueDevTools(), vue(), tsconfigPaths(), UnoCSS()],
  server: {
    port: 2323,
  },

  base: '',
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: 'import {h, Fragment} from "vue"',
  },
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },
})
