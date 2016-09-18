var http = require('http');

var express = require('express');
var router = express.Router();

var ports = require('../lib/serial-port');
var parser = require('../lib/api-parser');
var handlerWeight = require('../lib/handlers/weight');
var handlerSensor = require('../lib/handlers/sensor');
var info = require('../lib/info');
var configurator = require('../lib/configurator');

var Response = require('../lib/response');
var OptionsCreator = require('../lib/options-creator');
var AtomError = require('../lib/error');


//////////////////
/* API          */

router.get('/info', function(req, res) {
  info.getInfoAboutDevice(function(error, info) {
    if (error) {
      var response = new Response(error);
      response.send(res);
    } else if (info) {
      var response = new Response(info);
      response.send(res);
    } else {
      var response = new Response('Unknown device');
      response.send(res);
    }
  });
});

router.get('/restart', function(req, res) {
  var response = new Response(true);
  response.send(res);

  global.app.restart(function() {
    console.log('Application was restarted.');
  });
});

router.get('/settings/config', function(req, res) {
  configurator.getAllConfigurations(function(error, data) {
    var response = new Response((error) ? error : data);
    response.send(res);
  });
});

router.get('/settings/config/use', function(req, res) {
  configurator.getUsedConfiguration(function(error, data) {
    var response = new Response((error) ? error : data);
    response.send(res);
  });
});

router.post('/settings/config', function(req, res) {
  if (req.body) {
    configurator.addNewConfig(req.body, function() {
      var response = new Response(`New config ${req.body.name} was added`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.put('/settings/config', function(req, res) {
  if (req.body) {
    configurator.updateConfig(req.body, function() {
      var response = new Response(`Configuration ${req.body.name} was updated`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.delete('/settings/config', function(req, res) {
  if (req.query.id) {
    configurator.deleteConfig(req.query.id, function(err) {
      if (err) {
        var response = new Response('Failed to delete config');
        response.send(res);
      } else {
        var response = new Response(`Config was deleted`);
        response.send(res);
      }
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.get('/settings/device', function(req, res) {
  configurator.getAllDevices(function(error, data) {
    var response = new Response((error) ? error : data);
    response.send(res);
  });
});

router.post('/settings/device', function(req, res) {
  if (req.body) {
    configurator.addNewDevice(req.body, function() {
      var response = new Response(`New device ${req.body.name} was added`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.put('/settings/device', function(req, res) {
  if (req.body) {
    configurator.updateDevice(req.body, function() {
      var response = new Response(`Device ${req.body.name} was updated`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.delete('/settings/device', function(req, res) {
  if (req.query.id) {
    configurator.deleteDevice(req.query.id, function(err) {
      if (err) {
        var response = new Response('Failed to delete device');
        response.send(res);
      } else {
        var response = new Response(`Device was deleted`);
        response.send(res);
      }
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.get('/settings/plugin', function(req, res) {
  configurator.getAllPlugins(function(error, data) {
    var response = new Response((error) ? error : data);
    response.send(res);
  });
});

router.post('/settings/plugin', function(req, res) {
  if (req.body) {
    configurator.addNewPlugin(req.body, function() {
      var response = new Response(`New plugin ${req.body.vendor}-${req.body.model}-${req.body.tableName} was added`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.put('/settings/plugin', function(req, res) {
  if (req.body) {
    configurator.updatePlugin(req.body, function() {
      var response = new Response(`Plugin ${req.body.vendor}-${req.body.model}-${req.body.tableName} was updated`);
      response.send(res);
    });
  } else {
    sendInvalidIncomData(res);
  }
});

router.delete('/settings/plugin', function(req, res) {
  if (req.query.id) {
    configurator.deletePlugin(req.query.id, function(err) {
      if (err) {
        var response = new Response(`Failed to delete plugin`);
        response.send(res);
      } else {
        var response = new Response(`Plugin was deleted`);
        response.send(res);
      }
    });
  } else {
    sendInvalidIncomData(res);
  }
});

// get all ports
router.get('/all', function(req, res) {
  var onlyOpened = false;
  if (req.query.onlyOpened) {
    onlyOpened = Boolean(req.query.onlyOpened);
  }

  ports.getAllPorts(onlyOpened, function(error, portsArray) {
    var response = new Response((error) ? error : portsArray);
    response.send(res);
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

      var response = new Response((portIsOpen) ? true : error);
      response.send(res);
    });
  }
  else {
    var response = new Response(new AtomError(1));
    response.send(res);
  }
});

// close specific port by name
router.get('/close', function(req, res) {
  var comName = req.query.port;
  if (comName) {
    ports.closePortByName(comName, function(port) {
      var response = new Response(true);
      response.send(res);
    });
  }
  else {
    var response = new Response(new AtomError(4));
    response.send(res);
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
        var response = new Response(o);
        response.send(res);
      // }
    });
  }
  else {
    var response = new Response(new AtomError(5));
    response.send(res);
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
        var response = new Response(new AtomError(5));
        response.send(res);
      }
      else if (data) {
        var response = new Response(data);
        response.send(res);
      } else if (!data) {
        var response = new Response('Empty');
        response.send(res);
      }
    });
  } else {
    var response = new Response(new AtomError(8));
    response.send(res);
  }
});

router.get('/weight/setzero', function(req, res) {
  var port = req.query.port;

  // TODO: var port = (req.query.port) ? req.query.port : null;
  if (port) {
    handlerWeight.setZero(port, function(err) {
      if (err) {
        var response = new Response(err);
        response.send(res);
      } else {
        var response = new Response(true);
        response.send(res);
      }
    });
  } else {
    var response = new Response(new AtomError(1));
    response.send(res);
  }
});

router.get('/weight/clear', function(req, res) {
  var comName = (req.query.port) ? req.query.port : null;
  var date = parser.parseDate(req.query);

  handlerWeight.clear(comName, date, function(err) {
    if (err) {
      var response = new Response(new AtomError(5, err));
      response.send(res);
    } else {
      var response = new Response(true);
      response.send(res);
    }
  });
});


///////////////////
/* SENSOR        */

router.get('/sensor', function(req, res) {
  var date        = parser.parseDate(req.query);
  var reader      = (req.query.reader) ? req.query.reader : "";

  // TODO: var simple = (req.query.simple) ? req.query.simple : false;
  var port = (req.query.port) ? req.query.port : ports.randomPort(true);

  if (port) {
    handlerSensor.getLastValue(port, date, reader, function(err, data) {
      if (err) {
        var response = new Response(new AtomError(5, err));
        response.send(res);
      }
      else if (data) {
        var response = new Response(data);
        response.send(res);
      } else if (!data) {
        var response = new Response('Empty');
        response.send(res);
      }
    });
  } else {
    var response = new Response(new AtomError(8));
    response.send(res);
  }
});

router.get('/sensor/clear', function(req, res) {
  var comName = (req.query.port) ? req.query.port : null;
  var date = parser.parseDate(req.query);

  handlerSensor.clear(comName, date, function(err) {
    if (err) {
      var response = new Response(new AtomError(5));
      response.send(res);
    } else {
      var response = new Response(true);
      response.send(res);
    }
  });
});

module.exports = router;


function sendInvalidIncomData(res) {
  var response = new Response('Invalid income data');
  response.send(res);
}
