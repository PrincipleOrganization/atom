var Response = function(data, iserr, comport) {
  return {
    data: data,
    iserr: iserr,
    comport: comport
  }
}

module.exports.sendResponse = function(res, data, isErr, comPort) {
  var resObject = new Response();
  resObject.data = data;
  resObject.iserr = isErr;
  resObject.comport = comPort;

  res.json(resObject);
}

module.exports.Response = Response;
