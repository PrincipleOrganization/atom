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

exports.getDB = getDB;
exports.dbExicts = dbExicts;
