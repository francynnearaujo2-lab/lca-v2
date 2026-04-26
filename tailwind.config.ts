import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0A66C2', light: '#378FE9' },
        gold: { DEFAULT: '#F5A623' },
        surface: { DEFAULT: '#0D1117', card: '#161B22', hover: '#1C2230' },
        border: { DEFAULT: '#30363D', light: '#21262D' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config
