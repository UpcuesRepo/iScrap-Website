const gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const sourcemaps = require("gulp-sourcemaps");
const purgecss = require('gulp-purgecss');
const { series, parallel } = require('gulp');

//compile scss into css
function style() {
    return gulp.src('assets/scss/*')
    .pipe(sass().on('error',sass.logError))
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('assets/css'))
    .pipe(gulp.dest('assets/dist/css'))
    .pipe(browserSync.stream())
}


//PurgeCSS
function purgeCSS() {
    return gulp.src('assets/dist/css/*.css')
    .pipe(purgecss({
        content: ['pages/*.html','ui-elements/*.html','ui-components/*.html']
    }))
    .pipe(gulp.dest('assets/dist/css'))
    .pipe(browserSync.stream())
}

//Minify JS
function compress() {
    return (
        gulp
            .src([
                'assets/plugins/jquery/jquery-3.6.0.min.js',
                'assets/plugins/bootstrap/dist/js/bootstrap.bundle.js',
                'assets/plugins/bootstrap-select/dist/js/bootstrap-select.js',
                'assets/js/scripts.js',
            ])
            .pipe(uglify())
            .pipe(concat('all.min.js'))
            .pipe(gulp.dest("assets/dist/js"))
            .pipe(browserSync.stream())
    );
}

//Watch
function watch() {
    browserSync.init({
        server: {
           baseDir: "../iScrap-Website",
           index: "/pages/index.html"
        }
    });
    gulp.watch(['assets/scss/**/*'] ,style);
    // gulp.watch(['assets/css/*'] ,purgeCSS);
    gulp.watch('assets/js/*', compress);
    gulp.watch(['pages/**/*.html','ui-elements/*.html','ui-components/*.html']).on('change',browserSync.reload);
}


exports.default = series(style, compress, watch); //purgeCSS
exports.style = style
// exports.purgeCSS = purgeCSS
exports.compress = compress
exports.watch = watch