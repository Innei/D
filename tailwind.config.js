module.exports = {
  mode: 'jit',
  content: [
    './src/components/**/*.{vue,js,ts,jsx,tsx}',
    './src/views/**/*.{vue,js,ts,jsx,tsx}',
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
    },
  },
  variants: {},
  plugins: [],
}
