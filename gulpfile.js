var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
const zip = require('gulp-zip');

gulp.task('scripts', function () {
    return gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});

gulp.task('zip', () =>
    gulp.src('dist/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist'))
);