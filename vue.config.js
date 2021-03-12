module.exports = {
  publicPath: "./",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: ["sass-loader"]
        }
      ]
    }
  }
};
