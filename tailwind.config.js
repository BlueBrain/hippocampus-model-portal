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
        xl: '1400px', // Set the xl breakpoint to 1400px
        'xs': '480px'
      },
    },
  },
  plugins: [],
};