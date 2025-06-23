/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'vault': {
          'bg': 'var(--vault-bg)',
          'dark': 'var(--vault-dark)',
          'medium': 'var(--vault-medium)', 
          'light': 'var(--vault-light)',
          'cream': 'var(--vault-cream)'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'vault': 'var(--vault-shadow)',
        'vault-lg': 'var(--vault-shadow-lg)',
      }
    },
  },
  plugins: [],
}