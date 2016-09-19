var gulp = require("gulp");

var sourcemaps = require("gulp-sourcemaps");

var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var plumber = require("gulp-plumber"); // Error handling for sass

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

var browserSync = require('browser-sync').create();


// SASS compilation and minification

gulp.task("sass", function() {
  gulp.src("./sass/main.sass")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({browsers: "last 5 versions"}))
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
      .pipe(gulp.dest("./dist"))
      .pipe(browserSync.reload({stream: true}));
  }

  // Scripts for the front page
  buildScriptsForPage("js/home", "home.js");
  // Scrips for the "email sent" page
  buildScriptsForPage("js/emailsent", "emailsent.js");
});

// Compile everything at once
gulp.task("build", ["sass", "js"]);

// Watching

gulp.task("watch", ["build"], function() {
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
    ["./**/*.html", "!node_modules"],
    browserSync.reload
  );
});


gulp.task("default", ["watch", "serve"]);
