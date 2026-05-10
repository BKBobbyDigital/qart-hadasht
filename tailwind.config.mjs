/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        phoenician: ['Noto Sans Phoenician', 'serif'],
      },
      colors: {
        // Tyrian purple — the Phoenician color, our primary accent
        tyrian: {
          50: '#faf0f4',
          100: '#f5dee8',
          200: '#e8b8cc',
          300: '#d690ab',
          500: '#831843',
          600: '#6e1339',
          700: '#5b0f31',
          800: '#440b25',
          900: '#3d0a21',
        },
        // Sand-cream — the canvas color (sand-50 is now warmer / Anthropic-style)
        // and the secondary surface palette
        sand: {
          50: '#f4f0e6',  // warm cream — page background
          100: '#ece5d3', // slightly deeper cream — section variation
          200: '#dfd4ba', // border-friendly tan
          300: '#c9b794', // mid tan — borders, dividers
          500: '#a08660', // tan
          700: '#6b5638', // deep tan — secondary text
          900: '#3d3020', // very dark tan
        },
        // Near-black ink for text — sharper than the previous brown-black
        ink: {
          DEFAULT: '#111111',
          900: '#111111',
          800: '#1f1f1f',
          700: '#3a3a3a',
          500: '#6b6b6b',
        },
      },
      letterSpacing: {
        widestplus: '0.18em',
      },
    },
  },
  plugins: [],
};
