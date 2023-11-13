// uno.config.ts

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  presetWind,
  transformerAttributifyJsx,
} from 'unocss'

export default defineConfig({
  transformers: [transformerAttributifyJsx()],
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      autoInstall: true,
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'latin',
        mono: ['Fira Code', 'Fira Mono:400,700'],
      },
    }),
    presetWind({
      // not working
      // preflight: true,
      dark: 'class',
    }),
  ],
})
