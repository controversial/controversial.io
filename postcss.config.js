const autoprefixer = require('autoprefixer')({
  browsers: [
    // These are the defaults
    '> 1%',
    'last 2 versions',
    'Firefox ESR',
    // Extra support things
    'iOS >= 7',
    'ie >= 9',
  ],
});

module.exports = {
  plugins: [autoprefixer],
};
