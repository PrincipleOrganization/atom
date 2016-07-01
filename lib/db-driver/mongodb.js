var mongoose = require('mongoose');

var MongoDB = function() {
  this.db = mongoose;
}

MongoDB.prototype.start = function(callback) {
  var config = global.app.config;
  var env = process.vars.env;

  var base = (env === 'production') ? config.db.base.prod : config.db.base.dev;
  var dbhost = config.db.host;
  var dbport = config.db.port;
  var connString = `mongodb://${dbhost}:${dbport}/${base}`;
  this.db.connect(connString);

  var conn = this.db.connection;

  conn.on('error', console.error.bind(console, 'connection error:'));

  conn.once('open', function() {
    console.log(`Connected to DB on ${dbhost}:${dbport}/${base}`);

    callback();
  });
}

MongoDB.prototype.close = function(callback) {
  mongoose.connection.close(function() {
    if (callback) {
      callback();
    }
  });
}

exports = module.exports = MongoDB;
