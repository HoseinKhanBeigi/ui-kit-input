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
  plugins: [
    ["@babel/transform-runtime"],
    "@vue/babel-plugin-jsx",
    "@babel/plugin-transform-typescript",
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./src",
          "~": "./examples"
        }
      }
    ]
  ],
};
