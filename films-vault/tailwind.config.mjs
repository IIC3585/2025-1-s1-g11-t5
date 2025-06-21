/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'vault': {
          'dark': '#213448',
          'medium': '#547792', 
          'light': '#94B4C1',
          'cream': '#ECEFCA'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vault': '0 4px 6px -1px rgba(33, 52, 72, 0.1), 0 2px 4px -1px rgba(33, 52, 72, 0.06)',
        'vault-lg': '0 10px 15px -3px rgba(33, 52, 72, 0.1), 0 4px 6px -2px rgba(33, 52, 72, 0.05)',
      }
    },
  },
  plugins: [],
} 