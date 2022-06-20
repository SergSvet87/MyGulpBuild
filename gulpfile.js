// Подключение модулей
const gulp = require('gulp');
const gulpLess = require('gulp-less');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
// const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const del = require('del');

import imagemin from 'gulp-imagemin';

// Пути к файлам проекта
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist'
  },
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/*',
    dest: 'dist/img/'
  }
}

// Очистка каталогов и файлов
function clean() {
  return del(['dist'])
}

// Обработка html
function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
};

// Обработка стилей
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(gulpLess())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
}

// Обработка скриптов
function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
}

// Обработка изображений
// function images() {
//   return gulp.src(paths.images.src)
//     .pipe(imagemin({
//       progressive: true,
//       optimizationLevel: 3
//     }))
//     .pipe(gulp.dest(paths.images.dest))
// }

// Слежение за изменениями в файлах
function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

// Последовательное и паралельное выполнение  задач
const build = gulp.series(clean, html, gulp.parallel(styles, scripts), watch)

exports.clean = clean;
exports.html = html;
// exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;