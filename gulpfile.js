const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber'); // Error handling for sass

const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();

// Copy static files to dist folder
gulp.task('copy', () => {
  gulp.src(['./app/**/*', '!./app/**/*.js', '!./app/**/*.sass'])
    .pipe(gulp.dest('dist'));
});

// SASS compilation and minification

gulp.task('sass', () => {
  gulp.src('./app/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: 'last 5 versions' }))
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.reload({ stream: true }));
});

// JS compilation and minification

gulp.task('js', () => {
  // Build all the scripts from a directory into a file.
  function buildScriptsForPage(dir, path) {
    gulp.src(`${dir}/*.js`)
      .pipe(sourcemaps.init())
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat(path))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist'))
      .pipe(browserSync.reload({ stream: true }));
  }

  // Scripts for the front page
  buildScriptsForPage('app/js/home', 'home.js');
  // Scrips for the "email sent" page
  buildScriptsForPage('app/js/emailsent', 'emailsent.js');
});

// Compile everything at once
gulp.task('build', ['copy', 'sass', 'js']);

// Watching

gulp.task('watch', ['build'], () => {
  gulp.watch(['./app/**/*', '!./app/**/*.sass', '!./app/**/*.js'], ['copy']);
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./js/**/*.js', ['js']);
});

// Serving

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  });
  gulp.watch(
    ['./app/**/*.html'],
    browserSync.reload
  );
});

gulp.task('default', ['watch', 'serve']);
