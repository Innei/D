module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./components/**/*.{js,ts,jsx,tsx}', './views/**/*.{js,ts,jsx,tsx}'],

  theme: {
    extend: {
      screens: {
        'light-mode': { raw: '(prefers-color-scheme: light)' },
        'dark-mode': { raw: '(prefers-color-scheme: dark)' },
        phone: { raw: '(max-width: 768px)' },
        desktop: { raw: '(min-width: 1024px)' },
        tablet: { raw: '(max-width: 1024px)' },
      },
      colors: {
        theme: '#2ecc71',
        backcolor: 'rgb(255, 255, 249)',
      },
    },
  },
  variants: {},
  plugins: [],
}
