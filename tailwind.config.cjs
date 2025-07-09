// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1E40AF', // Example: Blue-800
        accent: '#F97316',  // Example: Orange-500
        border: '#E5E7EB',  // Tailwind gray-200
        background: '#FAFAFA',
      },
    },
  },
  plugins: [],
};
