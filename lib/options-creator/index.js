var serialPort = require('serialport');

module.exports = function(params) {
  var options = {
    parser: serialport.parsers.readline('\n')
  };

  if (params.baudRate) {
    options.baudRate = Number(params.baudRate);
  }

  if (params.dataBits) {
    options.dataBits = Number(params.dataBits);
  }

  if (params.stopBits) {
    options.stopBits = Number(params.stopBits);
  }

  if (params.parity) {
    options.parity = params.parity;
  }

  if (params.platformOptions) {
    options.platformOptions = params.platformOptions;
  }

  if (params.rtscts) {
    options.rtscts = params.rtscts;
  }

  if (params.xon) {
    options.xon = params.xon;
  }

  if (params.xoff) {
    options.xoff = params.xoff;
  }

  if (params.xany) {
    options.xany = params.xany;
  }

  if (params.flowControl) {
    options.flowControl = params.flowControl;
  }

  if (params.bufferSize) {
    options.bufferSize = Number(params.bufferSize);
  }

  return options;
}
