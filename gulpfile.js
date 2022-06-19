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
const del = require('del');

// Пути к файлам проекта
const paths = {
  styles: {
    src: 'src/styles/**/*.less',
    dest: 'dist/css/'
  },
  scriptcs: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  }
}

// Очистка каталогов и файлов
function clean() {
  return del(['dist'])
}

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
  return gulp.src(paths.scriptcs.src)
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scriptcs.dest))
}

// Слежение за изменениями в файлах
function watch() {
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scriptcs.src, scripts)
}

// Последовательное и паралельное выполнение  задач
const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.build = build;
exports.default = build;