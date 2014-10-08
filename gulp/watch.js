'use strict';

var gulp = require('gulp');

gulp.task('watch', ['styles'] ,function () {
  gulp.watch('app/data/*.json', ['data']);
  gulp.watch('app/styles/**/*.less', ['styles']);
  gulp.watch('app/scripts/**/*.coffee', ['scripts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
