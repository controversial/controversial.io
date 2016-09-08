var gulp = require("gulp");

var sourcemaps = require("gulp-sourcemaps");

var sass = require("gulp-sass");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

var browserSync = require('browser-sync').create();


// SASS compilation and minification

gulp.task("sass", function() {
  gulp.src("./sass/**/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.reload({stream: true}));
});


// JS compilation and minification

gulp.task("js", function() {
  // Build all the scripts from a directory into a file.
  function buildScriptsForPage(dir, path) {
    gulp.src(dir+"/*.js")
      .pipe(sourcemaps.init())
      .pipe(concat(path))
      .pipe(uglify())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("./dist"));
  }

  // Scripts for the front page
  buildScriptsForPage("js/home", "home.js");
  // Scrips for the "email sent" page
  buildScriptsForPage("js/emailsent", "emailsent.js");
});


// Watching

gulp.task("watch", ["sass", "js"], function() {
  gulp.watch("./sass/**/*.sass", ["sass"]);
  gulp.watch("./js/**/*.js", ["js"]);
});


// Serving

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: '.'
    },
  });
  gulp.watch(
    ["./js/**/*.js", "./sass/**/*.sass", "./**/*.html", "!node_modules"],
    browserSync.reload
  );
});


gulp.task("default", ["watch", "serve"]);
