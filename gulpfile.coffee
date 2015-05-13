gulp      = require('gulp')
coffee    = require('gulp-coffee')
concat    = require('gulp-concat')
gutil     = require('gulp-util')
header    = require('gulp-header')
prefixer  = require('gulp-autoprefixer')
rename    = require('gulp-rename')
sass      = require('gulp-sass')
uglify    = require('gulp-uglify')

pkg = require('./package.json')
banner = "/*! #{ pkg.name } #{ pkg.version } */\n"

gulp.task 'coffee', ->
  try
    gulp.src('./coffee/*')
      .pipe(coffee().on('error', gutil.log))
      .pipe(gulp.dest('./js/'))

    gulp.src('./docs/welcome/coffee/*')
      .pipe(coffee())
      .pipe(gulp.dest('./docs/welcome/js/'))
  catch e

gulp.task 'concat', ->
  gulp.src(['./bower_components/tether/tether.js', 'js/select.js'])
    .pipe(concat('select.js'))
    .pipe(header(banner))
    .pipe(gulp.dest('./'))

gulp.task 'uglify', ->
  gulp.src('./select.js')
    .pipe(uglify())
    .pipe(header(banner))
    .pipe(rename('select.min.js'))
    .pipe(gulp.dest('./'))

gulp.task 'js', ->
  gulp.run 'coffee', ->
    gulp.run 'concat', ->
      gulp.run 'uglify', ->

gulp.task 'sass', ->
  for path in ['', 'docs/welcome/']
    gulp.src("./#{ path }sass/*")
      .pipe(sass())
      .pipe(prefixer())
      .pipe(gulp.dest("./#{ path }css"))

gulp.task 'default', ->
  gulp.run 'js', 'sass'

  gulp.watch './**/*.coffee', ->
    gulp.run 'js'

  gulp.watch './**/*.sass', ->
    gulp.run 'sass'
