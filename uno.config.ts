// uno.config.ts

import { theme } from './theme'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  presetWind,
  transformerAttributifyJsx,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  transformers: [
    transformerAttributifyJsx(),
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  content: {
    filesystem: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}'],
  },
  theme,
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({}),
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
