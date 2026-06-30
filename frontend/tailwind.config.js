/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9EC8B9',
          50: '#f1f8f5',
          100: '#dcefe6',
          400: '#bcdccf',
          500: '#9EC8B9',
          600: '#7fae9c',
        },
        secondary: {
          DEFAULT: '#5C8374',
          600: '#4a6c5f',
        },
        dark: {
          DEFAULT: '#1B4242',
          800: '#143030',
        },
        bg: {
          DEFAULT: '#092635',
          light: '#0e3347',
        },
        accent: {
          DEFAULT: '#5C5470',
          light: '#B9B4C7',
        },
        'light-accent': '#B9B4C7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 20% 20%, rgba(158,200,185,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(92,131,116,0.18) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(92,84,112,0.2) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-18px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
