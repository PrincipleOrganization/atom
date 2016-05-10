var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var api = require('./api');

var ports = require('./lib/serial-port');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Open all ports
ports.getAllPorts(false, function(error, portsArray) {
  for (var i=0; i < portsArray.length; i++) {
    var currentPort = portsArray[i];
    ports.openPortByName(currentPort.comName, {}, function(error, comPortIsOpen) {
      if (error || !comPortIsOpen) {
        console.log(`Fail to open ${currentPort.comName}.`);
      }
    });
  }
});

// Initializing all working ports
global.comPorts = [];
ports.getAllPorts(true, function(error, portsArray) {
  for (var i=0; i < portsArray.length; i++) {
    global.comPorts.push(portsArray[i]);
  }
});


module.exports = app;