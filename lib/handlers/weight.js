var deviceConf = require('../device-config-read');
var ports = require('../serial-port');

var Weight = require('../models/weight').Weight;
var Plugin = require('../plugin');
var ErrorCreator = require('../error-creator');
var dataStreams = require('../data-streams');

exports.writeToDatabase = function(port, data) {
  var data = data.toString();

  var bytes = [];
  for (var i=0; i < data.length; i++) {
    bytes.push(data.charCodeAt(i));
  }

  var deviceConfigurations = deviceConf.deviceConfigurations(port);
  var vendor = deviceConfigurations.vendor;
  var model = deviceConfigurations.model;
  var brkLineCode = deviceConfigurations.brkLineCode;

  if (bytes[bytes.length -1] === brkLineCode) {
    dataStreams.updateDataStream(port.path, data.substring(0, data.length - 1));
    //dataStreams.updateDataStream(port.path, data);

    var currentDate = new Date();
    var dataFromStream = dataStreams.getDataFromDataStream(port.path);

    var weight = new Weight({
      istring: dataFromStream,
      port: port.path,
      date: currentDate,
      device: {
        vendor: vendor,
        model: model
      }
    });

    var plugin = new Plugin(deviceConfigurations);
    plugin.connect();
    var processedData = plugin.execute(dataFromStream);
    for (var keyPD in processedData) {
        weight[keyPD] = processedData[keyPD];
    }

    weight.save(function(err, rec) {
      if (err) {
        console.log(err);
      }

      var recString = JSON.stringify(rec);
      if (rec && process.vars.env === 'development') {
        console.log(`Created new record in DB with fields: ${recString}`);
      }

      var socketServer = global.SocketServer;
      socketServer.emitOnSocket(port, recString);
    });

    dataStreams.clearDataStream(port.path);
  }
  else {
    dataStreams.updateDataStream(port.path, data);
  }
}

exports.getLastWeight = function(port, date, stableUse, stableValue, reader, callback) {
  Weight.findLast({
      port: port,
      date: date,
      stable: {
        use: stableUse,
        value: stableValue
      },
      reader: reader
    }, function(err, data) {
      callback(err, data);
    });
};

exports.setZero = function(comName, callback) {
  if (typeof comName === 'string') {
    var port = ports.findPortByNameInOpenedPorts(comName);
  } else {
    var port = comName;
  }

  if (port) {
    var deviceConfigurations = deviceConf.deviceConfigurations(port);
    var bytes = deviceConfigurations.setzero;

    var i = 0;

    if (bytes instanceof Array && bytes.length != 0) {
      var currentItem = bytes[0];
      if (currentItem instanceof Array) {
        writeToPortRecur(port, bytes, currentItem, i, function() {
          if (callback) {
            callback();
          }
        });
      } else {
        ports.writeToPort(port, bytes, false, function(err) {
          if (callback) {
            if (err) {
              callback(err);
            } else {
              callback();
            }
          }
        });
      }
    }
  } else {
    if (callback) {
      callback(new ErrorCreator(7, `Serial port ${comName} is not open`));
    }
  }
}

exports.clear = function(comName, date, callback) {
  console.log(date);
  Weight.clear({port: comName, date: date}, function(err) {
    callback(err);
  });
}
