const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@services': path.resolve(__dirname, 'src/services/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
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
