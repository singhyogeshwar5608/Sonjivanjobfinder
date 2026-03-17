/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6edff',
          100: '#e9d4ff',
          200: '#d4a9ff',
          300: '#b56bff',
          400: '#9a3fe6',
          500: '#7f1ccf',
          600: '#6a0dad',
          700: '#580c8f',
          800: '#450a70',
          900: '#2d0649',
        },
        accent: {
          50: '#e6fffa',
          100: '#c0fff1',
          200: '#8bf5df',
          300: '#4fe5cb',
          400: '#27d7bb',
          500: '#20c997',
          600: '#18a27a',
          700: '#137c5d',
          800: '#0d5641',
          900: '#083126',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
