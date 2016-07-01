var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();

var path = path.resolve('./config/store.ac');
var db = new sqlite3.Database(path);

exports.db = db;

exports.dbExicts = function() {
  return fs.existsSync(path);
};
