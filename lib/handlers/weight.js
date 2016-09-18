var ports = require('../serial-port');

var Weight = require('../models/weight');
var Plugin = require('../plugin');
var AtomError = require('../error');
var dataStreams = require('../data-streams');

exports.writeToDatabase = function(port, data) {
  var path = port.path;

  dataStreams.updateDataStream(path, data);
  var dataFromStream = dataStreams.getDataFromDataStream(path);

  var deviceConfig = port.deviceConfigurations;
  var plugin = deviceConfig.plugin;

  plugin.execute(dataFromStream, function(ready, processedData) {
    if (ready) {
      var currentDate = new Date();

      var weight = {
        istring: '',
        port: path,
        date: currentDate,
        stable: false,
        value: 0,
        units: '',
        device: {
          vendor: deviceConfig.vendor,
          model: deviceConfig.model
        }
      };

      for (var key in processedData) {
        try {
          weight[key] = processedData[key];
        } catch(e) {
          console.log(e);
        }
      }

      Weight.new(weight, function(err, rec) {
        if (err) {
          console.log(err);
        }

        var recString = JSON.stringify(rec);
        if (rec && process.vars.env === 'development') {
          console.log(`Created new record in 'Weight' with fields: ${recString}`);
        }

        var socketServer = global.app.socketServer;
        socketServer.emitOnSocket(port, weight);
      });

      dataStreams.clearDataStream(path);
    }
  });


  // var data = data.toString();
  //
  // var bytes = [];
  // for (var i=0; i < data.length; i++) {
  //   bytes.push(data.charCodeAt(i));
  // }
  //
  // var deviceConfigurations = port.deviceConfigurations;
  // var vendor = deviceConfigurations.vendor;
  // var model = deviceConfigurations.model;
  // var brkLineCode = deviceConfigurations.brkLineCode;
  //
  // if (bytes[bytes.length -1] === brkLineCode) {
  //   dataStreams.updateDataStream(port.path, data.substring(0, data.length - 1));
  //
  //   var currentDate = new Date();
  //   var dataFromStream = dataStreams.getDataFromDataStream(port.path);
  //
  //   var weight = {
  //     istring: dataFromStream,
  //     port: port.path,
  //     date: currentDate,
  //     stable: false,
  //     weight: 0,
  //     units: '',
  //     device: {
  //       vendor: vendor,
  //       model: model
  //     }
  //   };
  //
  //   var plugin = deviceConfigurations.plugin;
  //   var processedData = plugin.execute(dataFromStream);
  //   for (var keyPD in processedData) {
  //       weight[keyPD] = processedData[keyPD];
  //   }
  //
  //   Weight.new(weight, function(err, rec) {
  //     if (err) {
  //       console.log(err);
  //     }
  //
  //     var recString = JSON.stringify(rec);
  //     if (rec && process.vars.env === 'development') {
  //       console.log(`Created new record in Weight with fields: ${recString}`);
  //     }
  //
  //     var socketServer = global.app.socketServer;
  //     socketServer.emitOnSocket(port, recString);
  //   });
  //
  //   dataStreams.clearDataStream(port.path);
  // }
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
    var deviceConfigurations = port.deviceConfigurations;
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
      callback(new AtomError(7));
    }
  }
}

exports.clear = function(comName, date, callback) {
  console.log(date);
  Weight.clear({port: comName, date: date}, function(err) {
    callback(err);
  });
}
