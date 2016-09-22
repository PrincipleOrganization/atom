var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var _ = require('underscore');

var AtomError = require('../error');
var DeviceConfigurations = require('../device-config-read');
var handlerWeight = require('../handlers/weight');
var handlerSensor = require('../handlers/sensor');
var commander = require('../commander');
var ascii = require('../ascii');
var dataStreams = require('../data-streams');

// Get all ports
exports.getAllPorts = function(onlyOpened, callback) {
  serialPort.list(function(err, ports) {
    if (err) {
      var error = new AtomError(3, err);

      ports = [];
    }

    if (onlyOpened) {
      var openedPorts = [];
      for (var i=0; i < ports.length; i++) {
        var currentPort = ports[i];
        for (var j=0; j < global.app.serialPorts.length; j++) {
          var openedPort = global.app.serialPorts[j];
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
exports.openPortByName = function(comName, callback) {
  var comNameValid = pathIsValid(comName);
  if (comNameValid) {
    var comPort = findPortByNameInOpenedPorts(comName);
    if (!comPort) {
      var devConf = new DeviceConfigurations({path:comName});
      var options = devConf.options;
      comPort = new SerialPort(comName, options, false);
      comPort.deviceConfigurations = devConf;
    }

    if (!comPort.isOpen()) {
      comPort.open(function(err) {
        var comPortIsOpen = true;
        if (err) {
          var error = new AtomError(2, err);
          comPortIsOpen = false;
        }

        if (comPortIsOpen) {
          addPortToOpenedPorts(comPort);
          initializeOnDataEvent(comPort);
          initCommonRequest(comPort);
          startSocket(comPort);
        }

        if (callback) {
          callback(error, comPortIsOpen, comPort);
        }
      });
    }
    else {
      addPortToOpenedPorts(comPort);
      initializeOnDataEvent(comPort);
      initCommonRequest(comPort);
      startSocket(comPort);

      if (callback) {
        callback(null,true);
      }
    }
  } else {
    if (callback) {
      callback(new AtomError(2, `No device in settings for ${comPort}.`), false);
    }
  }
}

// Close port by name
exports.closePortByName = function(comName, callback) {
  _.each(global.app.serialPorts, function(port) {
    if (port.path === comName) {
      global.app.serialPorts.splice(global.app.serialPorts.indexOf(port), 1);
      port.close(function() {
        if (callback) {
          callback(port);
        }
      });
    }
  });
}

exports.closeAllPorts = function(callback) {
  var ports = global.app.serialPorts;
  for (var index in ports) {
    var port = ports[index];
    global.app.serialPorts.splice(global.app.serialPorts.indexOf(port), 1);
    port.close(function() {
      if (global.app.serialPorts.length == 0 && callback) {
        callback();
        return;
      }
    });
  }

  if (ports.length === 0 && callback) {
    callback();
  }
}

// Write to port by name
function writeToPort(comName, bytes, addBrkLineCode, callback) {
  if (typeof comName === 'string') {
    var port = findPortByNameInOpenedPorts(comName);
  } else {
    var port = comName;
  }

  if (port) {
    if (addBrkLineCode) {
      var deviceConfigurations = port.deviceConfigurations;
      var brkLineCode = deviceConfigurations.brkLineCode;

      bytes.push(brkLineCode);
    }

    var asciiToWrite = ascii.generateFromDecimalArray(bytes);
    port.write(asciiToWrite, function() {
      port.drain(function() {
        if (callback) {
          callback();
        }
      });
    });
  }
  else {
    if (callback) {
      callback(new AtomError(5));
    }
  }
}

exports.writeToPort = writeToPort;

/////////////////////////
// PORT EVENTS         //

// On data event
function initializeOnDataEvent(port) {
  dataStreams.clearDataStream(port.path);
  port.on('data', function(data) {
    var deviceConfigurations = port.deviceConfigurations;
    if (deviceConfigurations.table === 'weight') {
      handlerWeight.writeToDatabase(port, data);
    } else if (deviceConfigurations.table === 'sensor') {
      handlerSensor.writeToDatabase(port, data);
    }
  });
};


/////////////////////////
// SERVICE             //

// Add port to opened ports
function addPortToOpenedPorts(port) {
  var comPortIsInOpen = false;
  for (var i=0; i < global.app.serialPorts.length; i++) {
    if (port == global.app.serialPorts[i]) {
      comPortIsInOpen = true;
    }
  }

  if (!comPortIsInOpen) {
    global.app.serialPorts.push(port);
  }
}

function initCommonRequest(port) {
  var deviceConfigurations = port.deviceConfigurations;
  var plugin = deviceConfigurations.plugin;
  plugin.initParams(function() {
    if (plugin.params) {
      var commonRequestBytes = plugin.params.commands.commonRequestBytes;
      if (commonRequestBytes) {
        commander.newIntervalCommand(port, function() {
          writeToPort(port.path, commonRequestBytes, false, null);
        });
      }
    }
  });
}

function findPortByNameInOpenedPorts(name) {
  for (var i=0; i < global.app.serialPorts.length; i++) {
    var currentPort = global.app.serialPorts[i];
    if (name == currentPort.path) {
      return currentPort;
    }
  }

  return undefined;
}

function startSocket(port) {
  var socketServer = global.app.socketServer;
  var socket = socketServer.findSocket(port);
  if (!socket) {
    global.app.socketServer.startSocket(port);
  }
}

exports.findPortByNameInOpenedPorts = findPortByNameInOpenedPorts;

function writeToPortRecur(port, bytes, currentItem, i, callback) {
  module_self.writeToPort(port, currentItem, false, function() {
    i++;

    if (i < bytes.length) {
      writeToPortRecur(port, bytes, bytes[i], i, callback);
    } else {
      if (callback) {
        callback();
      }
    }
  });
}

function randomPort(onlyName) {
  var port = null;

  if (global.app.serialPorts.length != 0) {
    port = global.app.serialPorts[0];
    if (onlyName) {
      port = port.path;
    }
  }

  return port;
}

exports.randomPort = randomPort;

function pathIsValid(path) {
  return !!global.app.getDeviceByPath(path);
}
