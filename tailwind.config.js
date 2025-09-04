/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(220 15% 95%)',
        text: 'hsl(220 15% 20%)',
        accent: 'hsl(180 70% 45%)',
        primary: 'hsl(220 80% 50%)',
        surface: 'hsl(0 0% 100%)',
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
        'pill': '9999px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 15%, 20%, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
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
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(135deg, hsl(220 80% 50%) 0%, hsl(180 70% 45%) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
    },
  },
  plugins: [],
}