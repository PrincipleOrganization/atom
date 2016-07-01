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
  configurator.load(global.app, function(error) {
    if (error) {
      console.log(error);
    }

    global.app.dbDriver = new DBDriver(global.app.config.db.vendor);
    if (global.app.socketServer) {
      global.app.socketServer.stopServer();
    } else {
      global.app.socketServer = new SocketServer(global.app.config.sockets);
    }

    commander.initIntervalCommands(global.app);
    dataStreams.initDataStreams(global.app);

    if (callback) {
      callback();
    }
  });
}

Application.prototype.start = function() {
  global.app.dbDriver.start(function() {
    var port = (process.vars.env === 'production') ? global.app.config.port.prod : global.app.config.port.dev;

    var exp = require('../express');
    exp.set('env', process.vars.env);
    exp.set('port', port);

    var server = exp.listen(port, function() {
      global.app.server = server;
      console.log("Local server listeting on port " + port);

      // Open all ports
      var ports = require('../serial-port');
      ports.getAllPorts(false, function(error, portsArray) {
        for (var i=0; i < portsArray.length; i++) {
          var currentPort = portsArray[i];
          if (currentPort.comName != '/dev/ttyAMA0') {
            ports.openPortByName(currentPort.comName, function(error, comPortIsOpen, comPort) {
              if (error || !comPortIsOpen) {
                console.log(`Fail to open ${currentPort.comName}.`);
              }
            });
          }
        }
      });
    });
  });
}

Application.prototype.stop = function(callback) {
  // close all serialports
  ports.closeAllPorts(function() {
    console.log('All serial ports were closed.');

    // close db connection
    global.app.dbDriver.close(function() {
      console.log('Connection to database was closed');

      // close server
      global.app.server.close(function() {
        console.log('Server was closed.');

        if (callback) {
          callback();
        }
      });
    });
  });
}

module.exports = Application;
