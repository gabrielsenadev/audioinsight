import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#111111',
        primary: '#0466c8',
      },
      animation: {
        'wave-normal': 'wave-normal 1s ease-in-out infinite',
        'wave-loud': 'wave-loud 1.2s ease-in-out infinite',
        'wave-quiet': 'wave-quiet 1.1s ease-in-out infinite',
      },

      keyframes: {
        'wave-normal': {
          '25%': {
            transform: 'scaleY(1)'
          },
          '50%': {
            transform: 'scaleY(.4)'
          },
          '75%': {
            transform: 'scaleY(.6)'
          },
        },
        'wave-loud': {
          '25%': {
            transform: 'scaleY(1)'
          },
          '50%': {
            transform: 'scaleY(.8)'
          },
          '75%': {
            transform: 'scaleY(.6)'
          },
        },
        'wave-quiet': {
          '25%': {
            transform: 'scaleY(1)'
          },
          '50%': {
            transform: 'scaleY(.2)'
          },
          '75%': {
            transform: 'scaleY(.4)'
          },
        },
      }
    },
  },
  plugins: [],
};
export default config;