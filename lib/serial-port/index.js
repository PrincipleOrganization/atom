var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var _ = require('underscore');

var ErrorCreator = require('../error-creator');
var Weight = require('../models/weight').Weight;
var deviceConf = require('../device-config-read');

var module_self = {};

// Get all ports
module_self.getAllPorts = function(onlyOpened, callback) {
  serialPort.list(function(err, ports) {
    if (err) {
      var error = new ErrorCreator(3, 'Can not get all ports', err);

      ports = [];
    }

    if (onlyOpened) {
      var openedPorts = [];
      for (var i=0; i < ports.length; i++) {
        var currentPort = ports[i];
        for (var j=0; j < global.comPorts.length; j++) {
          var openedPort = global.comPorts[j];
          if (currentPort.comName == openedPort.path && openedPort.isOpen()) {
            openedPorts.push(currentPort);
          }
        }
      }
      callback(error, openedPorts);
    }
    else {
      callback(error, ports);
    }
  });
}

// Open port by name
module_self.openPortByName = function(comName, options, callback) {
  var comPort = findPortByNameInOpenedPorts(comName);
  if (!comPort) {
    comPort = new SerialPort(comName, options, false);
  }

  if (!comPort.isOpen()) {
    comPort.open(function(err) {
      var comPortIsOpen = true;
      if (err) {
        var error = new ErrorCreator(2, `Can not open comPort ${comName}`, err);

        comPortIsOpen = false;
      }

      if (comPortIsOpen) {
        addPortToOpenedPorts(comPort);
        initializeOnDataEvent(comPort);
      }

      callback(error, comPortIsOpen);
    });
  }
  else {
    addPortToOpenedPorts(comPort);
    initializeOnDataEvent(comPort);

    callback(null,true);
  }
}

// Close port by name
module_self.closePortByName = function(comName, callback) {
  _.each(global.comPorts, function(port) {
    if (port.path === comName) {
      port.close(function() {
        callback(port);
      });
    }
  });
}

// Write to port by name
module_self.writeToPort = function(comName, bytes, callback) {
  console.log(bytes);
  var port = findPortByNameInOpenedPorts(comName);
  if (port) {
    var deviceConfigurations = deviceConf.deviceConfigurations(port);
    var brkLineCode = deviceConfigurations.brkLineCode;

    console.log(brkLineCode);

    bytes.push(brkLineCode);

    port.write(bytes, function() {
      port.drain(function(o) {
        callback(o);
      });
    });
  }
  else {

  }
}


/////////////////////////
// PORT EVENTS         //

// On data event
function initializeOnDataEvent(port) {
  var flowdata = '';
  port.on('data', function(data) {

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

      console.log(`${port.path} wrote : ${flowdata}`);


      // TODO: Config here
      var weightKG = 0;
      var units = "";
      if (vendor === 'koda' && model === 'd400') {
        var kgIndex = data.indexOf('kg');
        units = 'kg';
        weightKG = data.substring(0, kgIndex -1);
        weightKG = Number(weightKG);
      }


      var weight = new Weight({
        isrting: flowdata,
        port: port.path,
        date: new Date(),
        weight: weightKG,
        units: units,
        device: {
          vendor: vendor,
          model: model
        }
      });
      weight.save(function(err, rec, affected) {
        if (err) {
          console.log(err);
        }

        if (rec && process.vars.env === 'development') {
          console.log(`Created new record in DB with fields: ${rec}`);
        }
      });

      flowdata = '';
    }
    else {
      flowdata = flowdata + data;
    }
  });
};


/////////////////////////
// SERVICE             //

// Add port to opened ports
function addPortToOpenedPorts(port) {
  var comPortIsInOpen = false;
  for (var i=0; i < global.comPorts.length; i++) {
    if (port == global.comPorts[i]) {
      comPortIsInOpen = true;
    }
  }

  if (!comPortIsInOpen) {
    global.comPorts.push(port);
  }
}

function findPortByNameInOpenedPorts(name) {
  console.log(global.comPorts);
  for (var i=0; i < global.comPorts.length; i++) {
    var currentPort = global.comPorts[i];
    if (name == currentPort.path) {
      return currentPort;
    }
  }

  return undefined;
}

module.exports = module_self;
