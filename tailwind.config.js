/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3B82F6',
        'custom-teal': '#14B8A6',
        'custom-light-gray': '#F3F4F6',
        'custom-dark-blue': '#1E3A8A',
      },
    },
  },
  plugins: [],
}

