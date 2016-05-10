var gulp = require('gulp');
var mkdirp = require('mkdirp');

gulp.task('mkdb', function() {
  mkdirp('./db', function (err) {
    if (err) {
      console.error(err)
    }
    else {
      console.log('Directory for DB created.');
    }
  });
});
