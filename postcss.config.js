module.exports = {
  plugins: {
    tailwindcss: {},
    'vue-cli-plugin-tailwind/purgecss': {},
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
