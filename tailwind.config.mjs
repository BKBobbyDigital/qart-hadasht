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
        // Neutral surface + text scale. Reworked July 2026 from the
        // all-cream palette to a clean near-white system: white reading
        // surfaces on a barely-warm canvas, hairline borders, and a
        // warm-gray (not brown) text scale. Warmth now lives almost
        // entirely in the tyrian accent. sand-50 is the white surface;
        // the page canvas is a distinct near-white set on <body>.
        sand: {
          50: '#ffffff',  // white — cards, infoboxes, reading surfaces
          100: '#f4f3ef', // faint warm gray — section bands, secondary surface
          200: '#eae7e1', // light hairline / stronger border
          300: '#e4e0d8', // hairline border, dividers (was tan #c9b794)
          500: '#b0aaa0', // muted rules / icon strokes
          600: '#6f6a61', // secondary text (slightly lighter)
          700: '#5c574f', // secondary text (was brown #6b5638)
          900: '#2b2823', // near-black warm
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
