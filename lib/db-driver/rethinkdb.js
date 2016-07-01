var RethinkDB = function() {
  var config = global.app.config;
  var options = {
    host: config.db.host,
    port: config.db.port,
    db: 'r_prod',
    min: 10,
    max: 50,
    bufferSize: 10
  };

  var thinky = require('thinky')(options);

  this.db = thinky;
}

RethinkDB.prototype.start = function(callback) {
  if (this.db && callback) {
    this.db.dbReady().then(function() {
      callback();
    });
  }
};

RethinkDB.prototype.close = function(callback) {
  this.db.r.getPool().drain();
  if (callback) {
    callback();
  }
}

exports = module.exports = RethinkDB;
