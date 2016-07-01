var path = require('path');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var errorCreator = require('../error-creator');

var path = path.resolve('./config/store.ac');
var db = new sqlite3.Database(path);

var AtomConfiguration = function(name, params) {
  this.devices = [];

  if (name && params) {
    this.name = name;
    for (var key in params) {
        this[key] = params[key];
    }
  } else {
    this.name = 'Fallback';
    this.params = getDefaultConfigs();
  }
}

var Device = function(params) {
  this.options = {};

  this.name                 = params.name;
  this.path                 = params.path;
  this.table                = params.tableName;
  this.vendor               = params.vendor;
  this.model                = params.model;
  this.units                = params.units;
  this.options.baudRate     = params.baudRate;
  this.options.dataBits     = params.dataBits;
  this.options.stopBits     = params.stopBits;
  this.options.parity       = params.parity;
  this.options.rtscts       = params.rtscts;
  this.options.xon          = params.xon;
  this.options.xoff         = params.xoff;
  this.options.xany         = params.xany;
  this.options.flowControl  = params.flowControl;
  this.options.bufferSize   = params.bufferSize;
}

var load = function(app, callback) {
  var dbExicts = fs.existsSync(path);
  if (dbExicts) {
    initConfiguration(app, function(error) {
      callback(error);
    });
  } else {
    initDatabase(function() {
      initConfiguration(app, function(error) {
        callback(error);
      });
    });
  }
}

var initConfiguration = function(app, callback) {
  db.get(
    'SELECT name, params FROM configs WHERE use = 1',
    function(err, row) {
      var error = null;
      if (err) {
        error = errorCreator(9, `Can't find any working configuration`, err);
      }

      var name;
      var params;
      if (row) {
        name = row.name;
        params = JSON.parse(row.params);
      }

      var config = new AtomConfiguration(name, params);
      fillDevicesInConfig(config, function(err) {
        if (err) {
          error = errorCreator(10, `Can't find any device in configuration`, err);
        }

        app.config = config;

        callback(error);
      });
    }
  );
}

var fillDevicesInConfig = function(config, callback) {
  db.all(
    'SELECT * FROM devices WHERE use = 1',
    function(err, rows) {
      if (rows) {
        for (var index in rows) {
          var row = rows[index];
          var device = new Device(row);
          config.devices.push(device);
        }
      }

      callback(err);
    }
  );
}

var initDatabase = function(callback) {
  db.serialize(function() {
    // Configs
    db.run(`CREATE TABLE IF NOT EXISTS configs (
      name TEXT UNIQUE NOT NULL,
      params TEXT NOT NULL,
      use INTEGER NOT NULL DEFAULT 0,
      canBeDeleted INTEGER NOT NULL DEFAULT 1
    )`);

    var defConfigs = getDefaultConfigs();
    var configs = db.prepare('INSERT OR REPLACE INTO configs (name, params, use, canBeDeleted) VALUES (?, ?, ?, ?)');
    configs.run('default', JSON.stringify(defConfigs), true, false);
    configs.finalize();

    // Devices
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      name TEXT NOT NULL,
      path TEXT UNIQUE NOT NULL,
      tableName TEXT NOT NULL,
      vendor TEXT NOT NULL,
      model TEXT NOT NULL,
      units TEXT NOT NULL,
      baudRate INTEGER DEFAULT 9600,
      dataBits INTEGER DEFAULT 8,
      stopBits INTEGER DEFAULT 1,
      parity TEXT DEFAULT none,
      rtscts INTEGER DEFAULT 0,
      xon INTEGER DEFAULT 0,
      xoff INTEGER DEFAULT 0,
      xany INTEGER DEFAULT 0,
      flowControl INTEGER DEFAULT 0,
      bufferSize INTEGER DEFAULT 65536,
      use INTEGER NOT NULL DEFAULT 1
    )`);

    // Plugins
    db.run(`CREATE TABLE IF NOT EXISTS plugins (
      name TEXT UNIQUE NOT NULL,
      params TEXT NOT NULL
    )`);
  });

  callback();
}

var getDefaultConfigs = function() {
  return {
    "port": {
      "dev": 4000,
      "prod": 4001
    },
    "db": {
      "vendor": "rethinkdb",
      "host": "127.0.0.1",
      "port": "30000",
      "base": {
        "dev": "test",
        "prod": "local"
      },
      "maxCount": 1000000
    },
    "sockets": {
      "use": true,
      "port": 4002
    },
    "intervalCommands": {
      "use": true,
      "interval": 1000
    }
  };
}

exports.AtomConfiguration = AtomConfiguration;
exports.Device = Device;
exports.load = load;