/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'twitch-dark': '#18181b',
        'twitch-purple': '#9146ff',
      },
    },
  },
  corePlugins: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
