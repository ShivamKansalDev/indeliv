const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
    },
    configure: (webpackConfig) => {
      // Modify output filename for JavaScript files
      webpackConfig.output.filename = 'static/js/index.js';

      // Find the MiniCssExtractPlugin and change the filename for CSS files
      const miniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
      );

      if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.filename = 'static/css/index.css';
      }

      return webpackConfig;
    },
  },
  style: {
    sass: {
      loaderOptions: {
        additionalData: `@import "@styles/variables";`,
      },
    },
  },
};
