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
        // Tyrian purple — the Phoenician color
        tyrian: {
          50: '#fdf2f8',
          100: '#fce7f3',
          500: '#831843',
          700: '#5b0f31',
          900: '#3d0a21',
        },
        // Aged parchment / sandstone — Carthaginian context
        sand: {
          50: '#faf7f2',
          100: '#f4ede0',
          200: '#e8dcc4',
          300: '#d4bc94',
          500: '#a08660',
          700: '#6b5638',
          900: '#3d3020',
        },
      },
    },
  },
  plugins: [],
};
