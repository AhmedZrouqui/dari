import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Here we map our custom theme colors to Tailwind's color system
      colors: {
        'dari-blue': {
          '50': '#e7f5ff',
          '100': '#d0ebff',
          '200': '#a5d8ff',
          '300': '#74c0fc',
          '400': '#4dabf7',
          '500': '#339af0',
          '600': '#228be6', // Primary shade
          '700': '#1c7ed6',
          '800': '#1971c2',
          '900': '#1864ab',
        },
        'dari-teal': {
          '50': '#e6fcf5',
          '100': '#c3fae8',
          '200': '#96f2d7',
          '300': '#63e6be',
          '400': '#38d9a9',
          '500': '#20c997', // Accent shade
          '600': '#12b886',
          '700': '#0ca678',
          '800': '#099268',
          '900': '#087f5b',
        },
      },
    },
  },
  plugins: [],
};
export default config;
