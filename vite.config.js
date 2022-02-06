import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
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
