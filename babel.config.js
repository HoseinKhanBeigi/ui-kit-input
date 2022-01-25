module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.5%, not dead",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: ["@vue/babel-plugin-jsx"],
};
