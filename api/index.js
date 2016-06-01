var http = require('http');

var express = require('express');
var router = express.Router();

var ports = require('../lib/serial-port');
var parser = require('../lib/api-parser');
var responseSender = require('../lib/response-sender');
var handlerWeight = require('../lib/handlers/weight');

var OptionsCreator = require('../lib/options-creator');
var ErrorCreator = require('../lib/error-creator');
var Weight = require('../lib/models/weight').Weight;

var info = require('../info/info.json');
var packg = require('../package.json');

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


//////////////////
/* API PORTS     */

router.get('/info', function(req, res) {
  var information = {
    product: info.product,
    atom: {
      version: packg.version
    },
    author: packg.author,
    license: packg.license,
    bugs: packg.bugs.url,
    homepage: packg.homepage
  };
  res.json(information);
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

router.get('/clear', function(req, res) {
  var comName = (req.query.port) ? req.query.port : null;
  var date = parser.parseDate(req.query);

  Weight.clear({port: comName, date: date}, function(err) {
    if (err) {
      responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, comName);
    } else {
      responseSender.sendResponse(res, true, false, comName);
    }
  });
});


///////////////////
/* API WEIGHT    */

router.get('/weight/get', function(req, res) {
  var date        = parser.parseDate(req.query);
  var reader      = (req.query.reader) ? req.query.reader : "";
  var stableValue = (req.query.stable) ? req.query.stable : true;
  var stableUse   = (req.query.stable) ? true : false;

  // TODO: var simple = (req.query.simple) ? req.query.simple : false;
  var port = (req.query.port) ? req.query.port : ports.randomPort(true);

  if (port) {
    Weight.findLast({
        port: port,
        date: date,
        stable: {
          use: stableUse,
          value: stableValue
        },
        reader: reader
      }, function(err, data) {
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


module.exports = router;
