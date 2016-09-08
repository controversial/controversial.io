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
  // Scripts for the front page
  gulp.src("js/home/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("home.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));

  // Scrips for the "email sent" page
  gulp.src("js/emailsent/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("emailsent.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", function() {
  gulp.watch("./sass/**/*.sass", ["sass"]);
});

gulp.task("default", ["watch"]);
