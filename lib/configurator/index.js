var AtomError = require('../error');

var store = require('../store');

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

var load = function(callback) {
  var dbExicts = store.dbExicts();
  if (dbExicts) {
    initConfiguration(function(error, config) {
      callback(error, config);
    });
  } else {
    initDatabase(function() {
      initConfiguration(function(error, config) {
        callback(error, config);
      });
    });
  }
}

var initConfiguration = function(callback) {
  var db = store.getDB();
  db.get(
    'SELECT * FROM configs WHERE use = 1',
    function(err, row) {
      var error = null;
      if (err) {
        error = new AtomError(9, err);
      }

      var name;
      var params;
      if (row) {
        name = row.name;
        params = {
          port: {
            dev: row.port_dev,
            prod: row.port_prod
          },
          db: {
            vendor: row.db_vendor,
            host: row.db_host,
            port: row.db_port,
            base: {
              dev: row.db_base_dev,
              prod: row.db_base_prod
            },
            maxCount: row.db_maxcount
          },
          sockets: {
            use: (row.socket_use == '1') ? true : false,
            port: row.socket_port
          },
          intervalCommands: {
            use: (row.intervalCommands_use == '1') ? true : false,
            interval: row.intervalCommands_interval
          }
        };
      }

      var config = new AtomConfiguration(name, params);
      fillDevicesInConfig(config, function(err) {
        if (err) {
          error = new AtomError(10, err);
        }

        callback(error, config);
      });
    }
  );
}

var fillDevicesInConfig = function(config, callback) {
  var db = store.getDB();
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

var getAllConfigurations = function(callback) {
  var db = store.getDB();
  db.all(
    'SELECT * FROM configs',
    function(err, rows) {
      var error = null;
      if (err) {
        error = new AtomError(9, err);
      }

      var params = [];
      for (var i in rows) {
        var row = rows[i];
        if (row) {
          rowParams = {
            id: row.id,
            name: row.name,
            use: row.use,
            port: {
              dev: row.port_dev,
              prod: row.port_prod
            },
            db: {
              vendor: row.db_vendor,
              host: row.db_host,
              port: row.db_port,
              base: {
                dev: row.db_base_dev,
                prod: row.db_base_prod
              },
              maxCount: row.db_maxcount
            },
            sockets: {
              use: row.socket_use,
              port: row.socket_port
            },
            intervalCommands: {
              use: row.intervalCommands_use,
              interval: row.intervalCommands_interval
            }
          };

          params.push(rowParams);
        }
      }

      if (callback) {
        callback(error, params);
      }
    }
  );
}

var addNewConfig = function(cnf, callback) {
  var db = store.getDB();
  db.serialize(function() {
    var _config = db.prepare('INSERT OR REPLACE INTO configs (name, port_dev, port_prod, db_vendor, db_host, db_port, db_base_dev, db_base_prod, db_maxcount, socket_use, socket_port, intervalCommands_use, intervalCommands_interval, use, canBeDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    _config.run(
      cnf.name,
      '4000',
      cnf.port.prod,
      cnf.db.vendor,
      cnf.db.host,
      cnf.db.port,
      'test',
      cnf.db.base.prod,
      cnf.db.maxCount,
      cnf.sockets.use,
      cnf.sockets.port,
      cnf.intervalCommands.use,
      cnf.intervalCommands.interval,
      cnf.use,
      true
    );
    _config.finalize();
  });

  if (callback) {
    callback();
  }
}

var deleteConfig = function(id, callback) {
  var db = store.getDB();
  db.run('DELETE FROM configs WHERE id=(?)', id, function(err) {
    if (callback) {
      callback(err);
    }
  });
}

var getAllDevices = function(callback) {
  var db = store.getDB();
  db.all(
    'SELECT * FROM devices',
    function(err, rows) {
      var error = null;
      if (err) {
        error = new AtomError(9, err);
      }

      var devices = [];
      for (var i in rows) {
        var row = rows[i];
        if (row) {
          rowParams = {
            id: row.id,
            name: row.name,
            path: row.path,
            tableName: row.tableName,
            vendor: row.vendor,
            model: row.model,
            units: row.units,
            baudRate: row.baudRate,
            dataBits: row.dataBits,
            stopBits: row.stopBits,
            parity: row.parity,
            rtscts: row.rtscts,
            xon: row.xon,
            xoff: row.xoff,
            xany: row.xany,
            flowControl: row.flowControl,
            bufferSize: row.bufferSize,
            use: row.use
          };

          devices.push(rowParams);
        }
      }

      if (callback) {
        callback(error, devices);
      }
    }
  );
}

var addNewDevice = function(device, callback) {
  var db = store.getDB();
  db.serialize(function() {
    var _devices = db.prepare('INSERT OR REPLACE INTO devices (name, path, tableName, vendor, model, units, baudRate, dataBits, stopBits, parity, rtscts, xon, xoff, xany, flowControl, bufferSize, use) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    _devices.run(
      device.name,
      device.path,
      device.tableName,
      device.vendor,
      device.model,
      device.units,
      device.baudRate,
      device.dataBits,
      device.stopBits,
      device.parity,
      device.rtscts,
      device.xon,
      device.xoff,
      device.xany,
      device.flowControl,
      device.bufferSize,
      device.use
    );
    _devices.finalize();
  });

  if (callback) {
    callback();
  }
}

var deleteDevice = function(id, callback) {
  var db = store.getDB();
  db.run('DELETE FROM devices WHERE id=(?)', id, function(err) {
    if (callback) {
      callback(err);
    }
  });
}

var addNewPlugin = function(device, callback) {
  var db = store.getDB();
  db.serialize(function() {
    var _plugins = db.prepare('INSERT OR REPLACE INTO plugins (name, params) VALUES (?, ?)');
    _plugins.run(
      device.name,
      device.params
    );
    _plugins.finalize();
  });

  if (callback) {
    callback();
  }
}

var getAllPlugins = function(callback) {
  var db = store.getDB();
  db.all(
    'SELECT * FROM plugins',
    function(err, rows) {
      var error = null;
      if (err) {
        error = new AtomError(9, err);
      }

      var plugins = [];
      for (var i in rows) {
        var row = rows[i];
        if (row) {
          rowParams = {
            id: row.id,
            name: row.name,
            params: row.params
          };

          plugins.push(rowParams);
        }
      }

      if (callback) {
        callback(error, plugins);
      }
    }
  );
}

var deletePlugin = function(id, callback) {
  var db = store.getDB();
  db.run('DELETE FROM plugins WHERE id=(?)', id, function(err) {
    if (callback) {
      callback(err);
    }
  });
}

var initDatabase = function(callback) {
  var db = store.getDB();
  db.serialize(function() {
    // Configs
    db.run(`CREATE TABLE IF NOT EXISTS configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      port_dev TEXT NOT NULL,
      port_prod TEXT NOT NULL,
      db_vendor TEXT NOT NULL,
      db_host TEXT NOT NULL,
      db_port TEXT NOT NULL,
      db_base_dev TEXT NOT NULL,
      db_base_prod TEXT NOT NULL,
      db_maxcount TEXT NOT NULL,
      socket_use TEXT NOT NULL,
      socket_port TEXT NOT NULL,
      intervalCommands_use TEXT NOT NULL,
      intervalCommands_interval TEXT NOT NULL,
      use INTEGER NOT NULL DEFAULT 0,
      canBeDeleted INTEGER NOT NULL DEFAULT 1
    )`);

    var cnf = getDefaultConfigs();
    var _configs = db.prepare('INSERT OR REPLACE INTO configs (name, port_dev, port_prod, db_vendor, db_host, db_port, db_base_dev, db_base_prod, db_maxcount, socket_use, socket_port, intervalCommands_use, intervalCommands_interval, use, canBeDeleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    _configs.run(
      'default',
      cnf.port.dev,
      cnf.port.prod,
      cnf.db.vendor,
      cnf.db.host,
      cnf.db.port,
      cnf.db.base.dev,
      cnf.db.base.prod,
      cnf.db.maxCount,
      cnf.sockets.use,
      cnf.sockets.port,
      cnf.intervalCommands.use,
      cnf.intervalCommands.interval,
      true,
      false
    );
    _configs.finalize();

    // Devices
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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

    var dev = getTestDevice();
    var _device = db.prepare('INSERT OR REPLACE INTO devices (name, path, tableName, vendor, model, units, baudRate, dataBits, stopBits, parity, rtscts, xon, xoff, xany, flowControl, bufferSize, use) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    _device.run(
      dev.name,
      dev.path,
      dev.tableName,
      dev.vendor,
      dev.model,
      dev.units,
      dev.baudRate,
      dev.dataBits,
      dev.stopBits,
      dev.parity,
      dev.rtscts,
      dev.xon,
      dev.xoff,
      dev.xany,
      dev.flowControl,
      dev.bufferSize,
      dev.use
    );
    _device.finalize();

    // Plugins
    db.run(`CREATE TABLE IF NOT EXISTS plugins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      params TEXT NOT NULL
    )`);

    // Info
    db.run(`CREATE TABLE IF NOT EXISTS info (
      product TEXT UNIQUE NOT NULL,
      atom_version TEXT NOT NULL,
      author TEXT NOT NULL,
      license TEXT NOT NULL,
      bugs TEXT NOT NULL,
      homepage TEXT NOT NULL
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
      "vendor": "flow",
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

var getTestDevice = function() {
  return {
    name: 'Test',
    path: '/dev/ttyUSB0',
    tableName: 'weight',
    vendor: 'Test',
    model: 'Test',
    units: 'test',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    rtscts: 0,
    xon: 0,
    xoff: 0,
    xany: 0,
    flowControl: 0,
    bufferSize: 65536,
    use: 1
  }
}

exports.AtomConfiguration = AtomConfiguration;
exports.Device = Device;
exports.load = load;
exports.getAllConfigurations = getAllConfigurations;
exports.getAllDevices = getAllDevices;
exports.getAllPlugins = getAllPlugins;
exports.addNewConfig = addNewConfig;
exports.addNewDevice = addNewDevice;
exports.addNewPlugin = addNewPlugin;
exports.deleteConfig = deleteConfig;
exports.deleteDevice = deleteDevice;
exports.deletePlugin = deletePlugin;
