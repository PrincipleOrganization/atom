var Response = require('../response');

var module_self = {};

module_self.sendResponse = function(res, data, isErr, comPort) {
  var resObject = new Response();
  resObject.data = data;
  resObject.iserr = isErr;
  resObject.comport = comPort;

  res.json(resObject);
}

module.exports = module_self;
