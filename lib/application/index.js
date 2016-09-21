var configurator = require('../configurator');
var commander = require('../commander');
var dataStreams = require('../data-streams');

var DBDriver = require('../db-driver');
var SocketServer = require('../sockets');

var Application = function() {
  this.config = null;
  this.server = null;
  this.serialPorts = [];
  this.socketServer = null;
  this.intervalCommands = [];
  this.dataStreams = [];
  this.dbDriver = null;
}

Application.prototype.init = function(callback) {
  var self = this;
  configurator.load(function(error, config) {
    if (error) {
      console.log(error);
    }

    self.config = config;

    self.dbDriver = new DBDriver(self.config);
    self.socketServer = new SocketServer(self.config.sockets);

    commander.initIntervalCommands(self);
    dataStreams.initDataStreams(self);

    if (callback) {
      callback();
    }
  });
}

Application.prototype.start = function(callback) {
  var self = this;
  self.dbDriver.start(function() {
    var port = (process.vars.env === 'production') ? self.config.port.prod : self.config.port.dev;

    var exp = require('../express');
    exp.set('env', process.vars.env);
    exp.set('port', port);

    var server = exp.listen(port, function() {
      server = require('http-shutdown')(server);
      self.server = server;
      console.log("Local server listeting on port " + port);

      // Open all ports
      var ports = require('../serial-port');
      ports.getAllPorts(false, function(error, portsArray) {
        for (var i=0; i < portsArray.length; i++) {
          var currentPort = portsArray[i];
          if (currentPort.comName != '/dev/ttyS0') {
            ports.openPortByName(currentPort.comName, function(error, comPortIsOpen, comPort) {
              if (error || !comPortIsOpen) {
                console.log(`Fail to open ${currentPort.comName}.`);
              }
            });
          }
        }
      });

      if (callback) {
        callback();
      }
    });
  });
}

Application.prototype.stop = function(callback) {
  var self = this;
  commander.clearAllIntervals(function() {
    var ports = require('../serial-port');
    ports.closeAllPorts(function() {
      self.dbDriver.close(function() {
        self.socketServer.stopServer(function() {
          self.server.shutdown(function() {
            if (callback) {
              callback();
            }
          });
        });
      });
    });
  });
}

Application.prototype.restart = function(callback) {
  var self = this;
  self.stop(function() {
    self.init(function() {
      self.start(function() {
        if (callback) {
          callback();
        }
      });
    });
  });
}

Application.prototype.getDeviceByPath = function(path) {
  var devices = global.app.config.devices;

  var device = null;
  for (var i=0; i < devices.length; i++) {
    var currentDevice = devices[i];
    if (currentDevice.path === path) {
      device = currentDevice;
      break;
    }
  }

  // Plugins validation.

  return device;
}

exports = module.exports = Application;
