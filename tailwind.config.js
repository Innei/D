module.exports = {
  mode: 'jit',
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/views/**/*.{js,ts,jsx,tsx}',
  ],

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
        text: '#000',
        'text-gray': 'rgb(128, 128, 128)',
      },
      opacity: {
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        46: '0.46',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        85: '0.85',
        90: '0.9',
        95: '0.95',
      },
    },
  },
  variants: {},
  plugins: [],
}
