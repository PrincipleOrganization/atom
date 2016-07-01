var http = require('http');

var express = require('express');
var router = express.Router();

var ports = require('../lib/serial-port');
var parser = require('../lib/api-parser');
var responseSender = require('../lib/response-sender');
var handlerWeight = require('../lib/handlers/weight');
var handlerSensor = require('../lib/handlers/sensor');
var info = require('../lib/info');

var OptionsCreator = require('../lib/options-creator');
var ErrorCreator = require('../lib/error-creator');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


//////////////////
/* API PORTS     */

router.get('/info', function(req, res) {
  info.getInfoAboutDevice(function(error, info) {
    if (error) {
      responseSender.sendResponse(res, error, true, null);
    } else if (info) {
      responseSender.sendResponse(res, info, false, null);
    } else {
      responseSender.sendResponse(res, "Unknown device", true, null);
    }
  });
});

router.get('/restart', function(req, res) {
  // global.app.stop(function() {
    // restart
    global.app.init(function() {
      global.app.start();
    });
  // });
});

// get all ports
router.get('/all', function(req, res) {
  var onlyOpened = false;
  if (req.query.onlyOpened) {
    onlyOpened = Boolean(req.query.onlyOpened);
  }

  ports.getAllPorts(onlyOpened, function(error, portsArray) {
    responseSender.sendResponse(res, (error) ? error : portsArray, (error) ? true : false, null);
  });
});

// open specific port by name
router.get('/open', function(req, res) {
  var comName = req.query.port;

  if (comName) {
    ports.openPortByName(comName, function(error, portIsOpen) {
      if (portIsOpen) {
        console.log(`IVENT: comPort ${comName} is open`);
      }

      responseSender.sendResponse(res, (portIsOpen) ? true : error, (portIsOpen) ? false : true, comName);
    });
  }
  else {
    responseSender.sendResponse(res, new ErrorCreator(1, `Invalid comPort name ${comName}`), true, comName);
  }
});

// close specific port by name
router.get('/close', function(req, res) {
  var comName = req.query.port;
  if (comName) {
    ports.closePortByName(comName, function(port) {
      responseSender.sendResponse(res, true, false, comName);
    });
  }
  else {
    responseSender.sendResponse(res, new ErrorCreator(4, `Can not close port ${comName}`), true, comName);
  }
});

// execute command on specific com-port
router.get('/cmd', function(req, res) {
  var comName = req.query.port;
  var bytes = parser.parseCommand(req.query.cmd);
  var addBrkLineCode = (req.query.bl) ? req.query.bl : false;
  if (comName && bytes) {
    ports.writeToPort(comName, bytes, addBrkLineCode, function(o) {
      // if (o) {
      //   responseSender.sendResponse(res, new ErrorCreator(6, `Can not write to port ${comName}`), true, comName);
      // }
      // else {
        responseSender.sendResponse(res, o, false, comName);
      // }
    });
  }
  else {
    responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, comName);
  }
});


///////////////////
/* WEIGHT        */

router.get('/weight', function(req, res) {
  var date        = parser.parseDate(req.query);
  var reader      = (req.query.reader) ? req.query.reader : "";
  var stableValue = (req.query.stable) ? (req.query.stable === 'true') : true;
  var stableUse   = (req.query.stable) ? true : false;

  // TODO: var simple = (req.query.simple) ? req.query.simple : false;
  var port = (req.query.port) ? req.query.port : ports.randomPort(true);

  if (port) {
    handlerWeight.getLastWeight(port, date, stableUse, stableValue, reader, function(err, data) {
      if (err) {
        responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, port);
      }
      else if (data) {
        responseSender.sendResponse(res, data, false, port);
      } else if (!data) {
        responseSender.sendResponse(res, 'Empty', false, port);
      }
    });
  } else {
    responseSender.sendResponse(res, new ErrorCreator(8, `At least one serial port must be opened`), true, port);
  }
});

router.get('/weight/setzero', function(req, res) {
  var port = req.query.port;

  // TODO: var port = (req.query.port) ? req.query.port : null;
  if (port) {
    handlerWeight.setZero(port, function(err) {
      if (err) {
        responseSender.sendResponse(res, err, true, port);
      } else {
        responseSender.sendResponse(res, true, false, port);
      }
    });
  } else {
    responseSender.sendResponse(res, new ErrorCreator(1, `Invalid comPort name ${port}`), true, port);
  }
});

router.get('/weight/clear', function(req, res) {
  var comName = (req.query.port) ? req.query.port : null;
  var date = parser.parseDate(req.query);

  handlerWeight.clear(comName, date, function(err) {
    if (err) {
      responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, comName);
    } else {
      responseSender.sendResponse(res, true, false, comName);
    }
  });
});


///////////////////
/* SENSOR        */

router.get('/sensor/get', function(req, res) {
  var date        = parser.parseDate(req.query);
  var reader      = (req.query.reader) ? req.query.reader : "";

  // TODO: var simple = (req.query.simple) ? req.query.simple : false;
  var port = (req.query.port) ? req.query.port : ports.randomPort(true);

  if (port) {
    handlerSensor.getLastValue(port, date, reader, function(err, data) {
      if (err) {
        responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, port);
      }
      else if (data) {
        responseSender.sendResponse(res, data, false, port);
      } else if (!data) {
        responseSender.sendResponse(res, 'Empty', false, port);
      }
    });
  } else {
    responseSender.sendResponse(res, new ErrorCreator(8, `At least one serial port must be opened`), true, port);
  }
});

router.get('/weight/clear', function(req, res) {
  var comName = (req.query.port) ? req.query.port : null;
  var date = parser.parseDate(req.query);

  handlerSensor.clear(comName, date, function(err) {
    if (err) {
      responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, comName);
    } else {
      responseSender.sendResponse(res, true, false, comName);
    }
  });
});

module.exports = router;
