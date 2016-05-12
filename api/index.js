var http = require('http');

var express = require('express');
var router = express.Router();

var ports = require('../lib/serial-port');
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
  var cmd = req.query.cmd;
  if (comName) {
    ports.writeToPort(comName, cmd, function(err) {
      if (err) {
        responseSender.sendResponse(res, new ErrorCreator(6, `Can not write to port ${comName}`), true, comName);
      }
      else {
        responseSender.sendResponse(res, true, false, comName);
      }
    });
  }
  else {
    responseSender.sendResponse(res, new ErrorCreator(5, `5. Can not execute command on port ${comName}`), true, comName);
  }
});


///////////////////
/* API WEIGHT    */

router.get('/weight', function(req, res) {
  var port = req.query.port;
  var year = req.query.Y;
  var month = req.query.M;
  var day = req.query.D;
  var hour = req.query.h;
  var minute = req.query.m;
  var second = req.query.s;

  var date = new Date(year, month -1, day, hour, minute, second, 0);

  Weight.findLast({port: port, date: date}, function(err, data) {
    if (err) {
      console.log(err);
    }
    else if (data) {
      res.json(data);
    }
  });
});


module.exports = router;
