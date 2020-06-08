const tailwindcss = require("tailwindcss");
module.exports = {
  syntax: "postcss-scss",
  plugins: [tailwindcss("./tailwind.config.js"), require("autoprefixer")]
};
