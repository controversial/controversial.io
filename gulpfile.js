var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");


gulp.task("sass", function() {
  gulp.src("./sass/**/*.sass")
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: "compressed"}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./css"));
});

gulp.task("watch", function() {
  gulp.watch("./sass/**/*.sass", ["sass"]);
});
