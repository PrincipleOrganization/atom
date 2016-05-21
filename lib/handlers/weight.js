var Weight = require('../models/weight').Weight;
var deviceConf = require('../device-config-read');
var Plugin = require('../plugin');
var dbCleaner = require('../db-cleaner');

exports.writeToDatabase = function(port, flowdata, data) {
  var bytes = [];
  for (var i=0; i < data.length; i++) {
    bytes.push(data.charCodeAt(i));
  }

  var deviceConfigurations = deviceConf.deviceConfigurations(port);
  var vendor = deviceConfigurations.vendor;
  var model = deviceConfigurations.model;
  var brkLineCode = deviceConfigurations.brkLineCode;

  if (bytes[bytes.length -1] === brkLineCode) {
    flowdata = flowdata + data.substring(0, data.length - 1);

    var currentDate = new Date();

    var weight = new Weight({
      isrting: flowdata,
      port: port.path,
      date: currentDate,
      device: {
        vendor: vendor,
        model: model
      }
    });

    var plugin = new Plugin(deviceConfigurations);
    plugin.connect();
    var processedData = plugin.execute(data);
    for (var keyPD in processedData) {
        weight[keyPD] = processedData[keyPD];
    }

    weight.save(function(err, rec, affected) {
      if (err) {
        console.log(err);
      }

      if (rec && process.vars.env === 'development') {
        console.log(`Created new record in DB with fields: ${rec}`);
      }

      dbCleaner.clear(currentDate);
      
      var SocketServer = global.SocketServer;
      SocketServer.emitOnSocket(port, weight);
    });

    flowdata = '';
  }
  else {
    flowdata = flowdata + data;
  }
}
