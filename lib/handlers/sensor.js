var ports = require('../serial-port');

var Sensor = require('../models/sensor');
var Plugin = require('../plugin');
var ErrorCreator = require('../error-creator');
var dataStreams = require('../data-streams');

exports.writeToDatabase = function(port, data) {
  var data = data.toString();

  var bytes = [];
  for (var i=0; i < data.length; i++) {
    bytes.push(data.charCodeAt(i));
  }

  var deviceConfigurations = port.deviceConfigurations;
  var vendor = deviceConfigurations.vendor;
  var model = deviceConfigurations.model;
  var brkLineCode = deviceConfigurations.brkLineCode;

  if (bytes[bytes.length -1] === brkLineCode) {
    dataStreams.updateDataStream(port.path, data.substring(0, data.length - 1));
    //dataStreams.updateDataStream(port.path, data);

    var currentDate = new Date();
    var dataFromStream = dataStreams.getDataFromDataStream(port.path);

    var sensor = {
      istring: dataFromStream,
      port: port.path,
      date: currentDate,
      value: "",
      device: {
        vendor: vendor,
        model: model
      }
    };

    var plugin = deviceConfigurations.plugin;
    var processedData = plugin.execute(dataFromStream);
    for (var keyPD in processedData) {
        sensor[keyPD] = processedData[keyPD];
    }

    Sensor.new(sensor, function(err, rec) {
      if (err) {
        console.log(err);
      }

      var recString = JSON.stringify(rec);
      if (rec && process.vars.env === 'development') {
        console.log(`Created new record in Sensors with fields: ${recString}`);
      }

      var socketServer = global.app.socketServer;
      socketServer.emitOnSocket(port, recString);
    });

    dataStreams.clearDataStream(port.path);
  }
  else {
    dataStreams.updateDataStream(port.path, data);
  }
}

exports.getLastValue = function(port, date, reader, callback) {
  Sensor.findLast({
      port: port,
      date: date,
      reader: reader
    }, function(err, data) {
      callback(err, data);
    });
};

exports.clear = function(comName, date, callback) {
  console.log(date);
  Sensor.clear({port: comName, date: date}, function(err) {
    callback(err);
  });
}
