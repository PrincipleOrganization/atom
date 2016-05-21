var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var _ = require('underscore');

var ErrorCreator = require('../error-creator');
var deviceConf = require('../device-config-read');
var handlerWeight = require('../handlers/weight');

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

      callback(error, comPortIsOpen, comPort);
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
module_self.writeToPort = function(comName, bytes, addBrkLineCode, callback) {
  var port = findPortByNameInOpenedPorts(comName);
  if (port) {
    if (addBrkLineCode) {
      var deviceConfigurations = deviceConf.deviceConfigurations(port);
      var brkLineCode = deviceConfigurations.brkLineCode;

      bytes.push(brkLineCode);
    }

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
    handlerWeight.writeToDatabase(port, flowdata, data);
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
  for (var i=0; i < global.comPorts.length; i++) {
    var currentPort = global.comPorts[i];
    if (name == currentPort.path) {
      return currentPort;
    }
  }

  return undefined;
}


module.exports = module_self;
