/*
 * @Author: Innei
 * @Date: 2020-11-18 15:45:07
 * @LastEditTime: 2021-03-14 11:16:23
 * @LastEditors: Innei
 * @FilePath: /nai-vue/postcss.config.js
 * Mark: Coding with Love
 */
// const purgecss = require('@fullhuman/postcss-purgecss')
module.exports = {
  plugins: {
    tailwindcss: {},
    '@fullhuman/postcss-purgecss': {
      content: [
        './public/**/*.html',
        './src/**/*.vue',
        './src/**/*.tsx',
        './src/**/*.css',
      ],
    },
    autoprefixer: {},
    'postcss-preset-env': {
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
      features: {
        'custom-properties': false,
        'nesting-rules': true,
        'color-mod-function': true,
        'system-ui-font-family': true,
        'hexadecimal-alpha-notation': true,
        'custom-media-queries': true,
        'media-query-ranges': true,
      },
    },
  },
}
