module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx, css, scss}",
    "./src/components/**/*.{js,ts,jsx,tsx, css, scss}",
    "./src/layouts/**/*.{js,ts,jsx,tsx, css, scss}",
    "./src/views/**/*.{js,ts,jsx,tsx, css, scss}",
    "./src/styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      screens: {
        lg: '1200px',
        xl: '1400px',
        'xs': '480px'
      },
    },
  },
  plugins: [],
};