/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '-1': '-1',
        '60': '60',
        '100': '100',
        'max': '9999',
      },
       colors: {
        // Primary color palette
        'primary': {
          DEFAULT: 'rgb(231 233 255)',
          dark: 'rgb(200 203 255)',
          light: 'rgb(245 246 255)',
        },
        // Secondary color palette
        'secondary': {
          DEFAULT: '#FBBF24',
          dark: '#D97706',
          light: '#FCD34D',
        },
        // Accent color palette
        'accent': {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          light: '#F87171',
        },
        // Background colors
        'background': {
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
          light: '#F9FAFB',
        },
        // Text colors
        'text': {
          primary: '#111827',
          secondary: '#6B7280',
          inverted: '#FFFFFF',
        },
      },
    }
  },
  plugins: [],
}

