import { colord } from 'colord'

function adjustColorShade(hexColor: string, factor: number): string {
  let r = parseInt(hexColor.slice(1, 3), 16)
  let g = parseInt(hexColor.slice(3, 5), 16)
  let b = parseInt(hexColor.slice(5, 7), 16)

  r = Math.min(Math.max(0, r * factor), 255)
  g = Math.min(Math.max(0, g * factor), 255)
  b = Math.min(Math.max(0, b * factor), 255)

  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

function generateColorShades(baseColor: string): string[] {
  const shades = [] as string[]
  for (let i = 0.6; i <= 1.4; i += 0.1) {
    shades.push(adjustColorShade(baseColor, i))
  }
  return shades
}

export const themeDef = {
  colors: {
    white: '#ffffff',
    black: '#0b1015',

    // gray
    'gray-900': '#1d2935',
    'gray-800': '#2c3e50',
    'gray-700': '#3e5770',
    'gray-600': '#4f6f7f',
    'gray-500': '#809fae',
    'gray-400': '#93b0be',
    'gray-300': '#b6c6ce',
    'gray-200': '#c8d3d9',
    'gray-100': '#e0e5e7',

    // primary
    'primary-900': '#1f5b83',
    'primary-800': '#246a99',
    'primary-700': '#2979af',
    'primary-600': '#2e88c5',
    'primary-500': '#3498db',
    'primary-400': '#39a7f0',
    'primary-300': '#3eb6ff',
    'primary-200': '#43c5ff',
    'primary-100': '#48d4ff',

    // accent

    'accent-900': '#974864',
    'accent-800': '#b15475',
    'accent-700': '#ca6086',
    'accent-600': '#e36c97',
    'accent-500': '#fd79a8',
    'accent-400': '#ff85b8',
    'accent-300': '#ff91c9',
    'accent-200': '#ff9dda',
    'accent-100': '#ffa9eb',

    // danger

    'danger-900': '#500000',
    'danger-800': '#850505',
    'danger-700': '#ac0d0d',
    'danger-600': '#cd1b1b',
    'danger-500': '#e83030',
    'danger-400': '#f44747',
    'danger-300': '#ff6565',
    'danger-200': '#ff9494',
    'danger-100': '#ffcaca',

    // warning
    'warning-900': '#702200',
    'warning-800': '#943800',
    'warning-700': '#b54d01',
    'warning-600': '#c85900',
    'warning-500': '#ea6e00',
    'warning-400': '#ff8915',
    'warning-300': '#ffa733',
    'warning-200': '#ffc45e',
    'warning-100': '#ffe6b0',

    // info
    'info-900': '#004576',
    'info-800': '#006294',
    'info-700': '#007db1',
    'info-600': '#0098c4',
    'info-500': '#03c2e6',
    'info-400': '#74e0ed',
    'info-300': '#9ae6ef',
    'info-200': '#bceef1',
    'info-100': '#e3f5f6',
  },
}

export const theme = {
  colors: Object.entries(themeDef.colors).reduce(
    (acc, [key, value]) => {
      acc[key] = value
      acc[`${key}-lighter`] = colord(value).lighten(0.025).toHex()
      acc[`${key}-darker`] = colord(value).darken(0.08).toHex()
      return acc
    },
    {} as Record<string, any>,
  ),
  fontFamily: {
    sans: 'Avenir, Helvetica, Arial, sans-serif',
  },
}
