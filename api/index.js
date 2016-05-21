var http = require('http');

var express = require('express');
var router = express.Router();

var ports = require('../lib/serial-port');
var parser = require('../lib/api-parser');
var responseSender = require('../lib/response-sender');

var OptionsCreator = require('../lib/options-creator');
var ErrorCreator = require('../lib/error-creator');
var Weight = require('../lib/models/weight').Weight;

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


///////////////////
/* API for TESTS */
router.get('/signal/good', function(req, res) {
  res.send('Good from Local on 4000');
});

router.get('/signal/bed', function(req, res) {
  res.send('Bad from Local on 4000');
});

router.get('/signal/normal', function(req, res) {
  res.send('Normal from Local on 4000');
});


///////////////////
/* API PORTS     */

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
  var comPortOptions = new OptionsCreator(req.query);

  if (comName) {
    ports.openPortByName(comName, comPortOptions, function(error, portIsOpen) {
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
  if (comName) {
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

router.get('/weight', function(req, res) {
  var port = req.query.port;
  var date = parser.parseDate(req.query);
  var reader = (req.query.reader) ? req.query.reader : "";

  Weight.findLast({port: port, date: date, reader: reader}, function(err, data) {
    if (err) {
      responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, port);
    }
    else if (data) {
      responseSender.sendResponse(res, data, false, port);
    } else if (!data) {
      responseSender.sendResponse(res, 'Empty', false, port);
    }
  });
});


module.exports = router;
