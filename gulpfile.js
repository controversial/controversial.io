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
  gulp.src("./js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./dist"));
});

gulp.task("watch", function() {
  gulp.watch("./sass/**/*.sass", ["sass"]);
});

gulp.task("default", ["watch"]);
