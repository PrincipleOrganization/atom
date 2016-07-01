var errorCreator = require('../error-creator');

var db = require('../store').db;

exports.getInfoAboutDevice = function(callback) {
  db.get(
    'SELECT * FROM info LIMIT 1',
    function(err, row) {
      var error = null;
      if (err) {
        error = errorCreator(11, `Can't find any info`, err);
      }

      var info = null;
      if (row) {
        info = {
          product: row.product,
          atom: {
            version: row.atom_version
          },
          author: row.author,
          license: row.license,
          bugs: row.bugs.url,
          homepage: row.homepage,
          configuration: global.app.config.name
        };
      }

      callback(error, info);
    }
  );
}
