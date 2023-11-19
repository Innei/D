import { resolve } from 'path'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths(),
    UnoCSS(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      manifest: {
        display: 'standalone',
        description:
          'A personal blog and space discussing technology, life, and more.',
        lang: 'zh-CN',
        name: '森',
        icons: [
          {
            src: '192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '256.png',
            sizes: '256x256',
            type: 'image/png',
          },

          {
            src: '512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        short_name: '森',
        theme_color: '#4a4a4a',
      },
    }),
  ],
  server: {
    port: 2323,
  },

  // base: '',
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
