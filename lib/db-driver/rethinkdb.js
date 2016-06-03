var RethinkDB = function() {
  var config = global._config;
  var options = {
    host: config.db.host,
    port: config.db.port,
    db: 'r_prod'
  };

  var thinky = require('thinky')(options);

  this.db = thinky;
}

RethinkDB.prototype.start = function(callback) {
  if (this.db && callback) {
    callback();
  }
};

exports = module.exports = RethinkDB;
