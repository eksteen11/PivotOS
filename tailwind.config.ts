import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#faf9f5',
        ink: '#121612',
        muted: '#73776f',
        accent: '#17724b',
        danger: '#b94032',
        warn: '#d7662f',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        deck: '0 1px 2px rgba(30,38,29,0.04), 0 10px 30px rgba(30,38,29,0.05)',
      },
    },
  },
  plugins: [],
}

export default config
