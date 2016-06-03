var MongoDB   = require('./mongodb.js');
var RethinkDB = require('./rethinkdb.js');

var DB_VENDOR_MONGODB   = 'mongodb';
var DB_VENDOR_RETHINKDB = 'rethinkdb';

var DBDriver = function(vendor) {
  this.vendor = vendor;

  if (this.vendor === DB_VENDOR_MONGODB) {
    this.driver = new MongoDB();
  } else if (this.vendor === DB_VENDOR_RETHINKDB) {
    this.driver = new RethinkDB();
  }
}

DBDriver.prototype.start = function(callback) {
  this.driver.start(function() {
    if (callback) {
      callback();
    }
  });
}

DBDriver.prototype.isMongoDB = function() {
  return this.vendor === DB_VENDOR_MONGODB;
}

DBDriver.prototype.isRethinkDB = function() {
  return this.vendor === DB_VENDOR_RETHINKDB;
}

exports.DBDriver = DBDriver;
