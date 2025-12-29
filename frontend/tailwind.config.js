/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Aquí es donde sucede la magia para tus clientes
        'primary-cliente': 'var(--primary-color)',
        'secondary-cliente': 'var(--secondary-color)',
      },
    },
  },
  plugins: [],
}