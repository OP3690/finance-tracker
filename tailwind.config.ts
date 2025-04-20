import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          50: 'var(--primary-50)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          hover: 'var(--secondary-hover)',
        },
        accent: 'var(--accent)',
        background: 'var(--background)',
        foreground: {
          DEFAULT: 'var(--foreground)',
          80: 'var(--foreground-80)',
          50: 'var(--foreground-50)',
        },
        card: {
          DEFAULT: 'var(--card)',
          50: 'var(--card-50)',
          30: 'var(--card-30)',
          20: 'var(--card-20)',
          80: 'var(--card-80)',
        },
        border: {
          DEFAULT: 'var(--border)',
          20: 'var(--border-20)',
          10: 'var(--border-10)',
        },
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      spacing: {
        18: '4.5rem',
        112: '28rem',
        120: '30rem',
      },
      height: {
        '8xl': '88vh',
        '9xl': '92vh',
        '10xl': '96vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      boxShadow: {
        'glow-sm': '0 2px 8px -1px rgba(59, 130, 246, 0.3)',
        'glow-md': '0 4px 12px -1px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 8px 20px -2px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
        'gradient-y': 'gradient-y 10s ease infinite',
        'gradient-xy': 'gradient-xy 10s ease infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      }
    },
  },
  plugins: [],
}

export default config 