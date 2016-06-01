var serialPort = require('serialport');
var SerialPort = serialPort.SerialPort;

var _ = require('underscore');

var ErrorCreator = require('../error-creator');
var deviceConf = require('../device-config-read');
var handlerWeight = require('../handlers/weight');
var commander = require('../commander');
var ascii = require('../ascii');
var dataStreams = require('../data-streams');

// Get all ports
exports.getAllPorts = function(onlyOpened, callback) {
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
exports.openPortByName = function(comName, callback) {
  var comPort = findPortByNameInOpenedPorts(comName);
  if (!comPort) {
    var devConf = deviceConf.deviceConfigurations({path:comName});
    var options = devConf.options;
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
        initCommonRequest(comPort);
      }

      callback(error, comPortIsOpen, comPort);
    });
  }
  else {
    addPortToOpenedPorts(comPort);
    initializeOnDataEvent(comPort);
    initCommonRequest(comPort);

    callback(null,true);
  }
}

// Close port by name
exports.closePortByName = function(comName, callback) {
  _.each(global.comPorts, function(port) {
    if (port.path === comName) {
      global.comPorts.splice(global.comPorts.indexOf(port), 1);
      port.close(function() {
        callback(port);
      });
    }
  });
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
      var deviceConfigurations = deviceConf.deviceConfigurations(port);
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
      callback(new ErrorCreator(5,`Can not execute command on port ${comName}`));
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
    handlerWeight.writeToDatabase(port, data);
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

function initCommonRequest(port) {
  var deviceConfigurations = deviceConf.deviceConfigurations(port);
  var commonRequestBytes = deviceConfigurations.commonRequestBytes;

  if (commonRequestBytes) {
    commander.newIntervalCommand(port, function() {
      writeToPort(port.path, commonRequestBytes, false, null);
    });
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

  if (global.comPorts.length != 0) {
    port = global.comPorts[0];
    if (onlyName) {
      port = port.path;
    }
  }

  return port;
}

exports.randomPort = randomPort;
