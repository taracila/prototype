'use strict';

var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  filter = require('gulp-filter'),
  twig = require('gulp-twig'),
  sass = require('gulp-ruby-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  autoprefixer = require('gulp-autoprefixer'),
  prettify = require('gulp-html-prettify'),
  reload = browserSync.reload,
  src = {
    scss: '../scss/**/*.scss',
    css: '../css',
    html: '../templates/**/*.twig',
  };

/**
 * Start the BrowserSync Static Server + Watch files
 */
gulp.task('serve', ['sass', 'templates'], function () {

  browserSync({
    server: "../",
    files: ["../css/styles.css", src.html]
  });

  gulp.watch(src.scss, ['sass']);
  gulp.watch(src.html, ['templates']);
});


/**
 * Kick off the sass stream with source maps + error handling
 */
function sassStream() {
  return sass('../scss', {
    sourcemap: true,
    style: 'expanded',
    unixNewlines: true
  })
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(autoprefixer({ browsers: ['> 5%', 'last 1 version']}))
    .pipe(sourcemaps.write('./', {
      includeContent: false,
      sourceRoot: '../scss'
    }));
}


/**
 * Compile sass, filter the results, inject CSS into all browsers.
 */
gulp.task('sass', function () {
  return sassStream()
    .pipe(gulp.dest(src.css))
    .pipe(filter("**/*.css"))
    .pipe(reload({
      stream: true
    }));
});


/**
 * Generate templates.
 */
gulp.task('templates', function () {
  return gulp.src(src.html)
    .pipe(twig())
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(gulp.dest('../'))
    .on("end", reload);
});

gulp.task('default', ['serve']);
