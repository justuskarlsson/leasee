const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/routes/**/*.{svelte, js, ts}',
    './src/lib/**/*.{svelte, js, ts}',
  ],
  plugins: [require('daisyui')],
  theme: {
    extend: {
      colors: {
        primary: "#f7f9fc", // bg-body
        secondary: "#ffffff", // bg-main
        background: "#f7f9fc", 
        active: "#c2e7ff", // something selected
        good: colors.green[400],
        bad: colors.red[400],
        main: "#001d35", // main font color
        ghost: "rgba(221, 204, 204, 0.5)"
      },
      animation: {
        'spin-slow': 'spin 3s ease-in-out infinite',
        'spin': 'spin 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite',
      },
    },
    container: {
      center: true,
    }
  }
};
