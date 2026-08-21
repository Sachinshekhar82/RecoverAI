/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: '#F7F7F5',
        surface: '#FFFFFF',
        textPrimary: '#171717',
        textSecondary: '#666666',
        textMuted: '#8A8A8A',
        borderColor: '#E7E7E3',
        primaryDark: '#20221F',
        
        success: {
          DEFAULT: '#197A55',
          bg: '#EAF6F0',
          border: '#C3E6D5'
        },
        warning: {
          DEFAULT: '#B7791F',
          bg: '#FFF6E5',
          border: '#F7E3BE'
        },
        danger: {
          DEFAULT: '#B42318',
          bg: '#FFF0EF',
          border: '#FECDCA'
        },
        info: {
          DEFAULT: '#3B5CCC',
          bg: '#F0F4FF',
          border: '#D0DDFB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '14px',
      }
    },
  },
  plugins: [],
}
