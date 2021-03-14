/*
 * @Author: Innei
 * @Date: 2021-03-14 11:05:02
 * @LastEditTime: 2021-03-14 15:08:39
 * @LastEditors: Innei
 * @FilePath: /nai-vue/vite.config.js
 * Mark: Coding with Love
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import analyze from 'rollup-plugin-analyzer'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths(), analyze()],
  server: {
    port: 2333,
  },
  base:
    process.env.NODE_ENV === 'development'
      ? undefined
      : 'https://cdn.jsdelivr.net/gh/mx-space/nai-vue@gh-pages/',
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
