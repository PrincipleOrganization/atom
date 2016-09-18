var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var _path = path.resolve('./config/store.ac');
var db;

var getDB = function() {
  if (!db) {
    db = new sqlite3.Database(_path);
  }
  return db;
}

var dbExicts = function() {
  return fs.existsSync(_path);
};

var getPluginParams = function(table, vendor, model, callback) {
  var query = `SELECT executeFunction, params FROM plugins WHERE tableName = '${table}' AND vendor = '${vendor}' AND model = '${model}'`;

  db.get(query, function(err, row) {
      var error;
      if (err) {
        error = new AtomError(9, err);
      }

      var executeFunction = '';
      var params = '';
      if (row) {
        executeFunction = row.executeFunction;
        params = row.params;
      }

      if (callback) {
        callback(error, executeFunction, params);
      }
    }
  );
}

exports.getDB = getDB;
exports.dbExicts = dbExicts;
exports.getPluginParams = getPluginParams;
