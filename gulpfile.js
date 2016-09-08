var gulp = require("gulp");

var sourcemaps = require("gulp-sourcemaps");

var sass = require("gulp-sass");

var concat = require("gulp-concat");
var uglify = require("gulp-uglify");


gulp.task("sass", function() {
  gulp.src("./sass/**/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
});

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

gulp.task("watch", function() {
  gulp.watch("./sass/**/*.sass", ["sass"]);
});

gulp.task("default", ["watch"]);
