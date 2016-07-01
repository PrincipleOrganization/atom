var MongoDB   = require('./mongodb.js');
var RethinkDB = require('./rethinkdb.js');
var Flow = require('./flow.js');

var DB_VENDOR_MONGODB   = 'mongodb';
var DB_VENDOR_RETHINKDB = 'rethinkdb';
var DB_VENDOR_FLOW      = 'flow';

var DBDriver = function(vendor) {
  this.vendor = vendor;

  if (this.vendor === DB_VENDOR_MONGODB) {
    this.driver = new MongoDB();
  } else if (this.vendor === DB_VENDOR_RETHINKDB) {
    this.driver = new RethinkDB();
  } else if (this.vendor === DB_VENDOR_FLOW) {
    this.driver = new Flow();
  }
}

DBDriver.prototype.start = function(callback) {
  this.driver.start(function() {
    if (callback) {
      callback();
    }
  });
}

DBDriver.prototype.close = function(callback) {
  this.driver.close(function() {
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

DBDriver.prototype.isFlow = function() {
  return this.vendor === DB_VENDOR_FLOW;
}

exports = module.exports = DBDriver;
