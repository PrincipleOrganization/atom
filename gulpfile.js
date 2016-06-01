var gulp = require('gulp');
var mkdirp = require('mkdirp');

gulp.task('prepare', function() {
  mkdirp('./db', function (err) {
    if (err) {
      console.error(err)
    }
    else {
      console.log('Directory for DB created.');
    }
  });

  mkdirp('./plugins', function (err) {
    if (err) {
      console.error(err)
    }
    else {
      console.log('Directory for plugins created.');
    }
  });

  mkdirp('./info', function (err) {
    if (err) {
      console.error(err)
    }
    else {
      console.log('Directory for info created.');
    }
  });

  // TODO: generate blank info file.
  // TODO: generate blank device/device.json
});
