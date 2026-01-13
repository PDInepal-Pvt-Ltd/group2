/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        surface: 'var(--surface-color)',
        background: 'var(--background-color)',
        text: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
      }
    },
  },
  plugins: [],
}
