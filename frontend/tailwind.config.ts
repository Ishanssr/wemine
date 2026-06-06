import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fefcf5',
          100: '#fdf6e8',
          200: '#f5e6cc',
        },
        glacier: {
          50: '#f4f9f9',
          100: '#e2edee',
          200: '#d0e5e5',
          300: '#a8c8c9',
          400: '#7aabad',
          500: '#558e91',
          600: '#437276',
          700: '#395d60',
        },
      },
      fontFamily: {
        heading: ['Helvetica Neue', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Helvetica Neue', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'btn': '0.05em',
        'title': '0.03em',
      },
    },
  },
  plugins: [],
};

export default config;
