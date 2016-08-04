var AtomError = require('../error');

var db = require('../store').getDB();

exports.getInfoAboutDevice = function(callback) {
  db.get(
    'SELECT * FROM info LIMIT 1',
    function(err, row) {
      var error = null;
      if (err) {
        error = new AtomError(11, err);
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
