module.exports.deviceConfigurations = function(port) {
  var portPath = port.path;
  var config = global._config;
  var devices = config.devices;

  var deviceConfigurations = {
    table:'',
    vendor: '',
    model: '',
    units: '',
    strLineCode: '',
    brkLineCode: '',
    waightRequest: '',
    waightRequestLastByte: ''
  };

  var device = null;
  for (var i=0; i < devices.length; i++) {
    var currentDevice = devices[i];
    if (currentDevice.path === portPath) {
      device = currentDevice;
      break;
    }
  }

  if (device) {
    var vendorPath = config.vendor[device.table];
    var vendor = require(`../../${vendorPath}.json`);

    deviceConfigurations.table = device.table;
    deviceConfigurations.vendor = device.vendor;
    deviceConfigurations.model = device.model;
    deviceConfigurations.units = device.units;
    deviceConfigurations.strLineCode = vendor[device.vendor][device.model].strLineCode;
    deviceConfigurations.brkLineCode = vendor[device.vendor][device.model].brkLineCode;
    deviceConfigurations.waightRequest = vendor[device.vendor][device.model].waightRequest;
    deviceConfigurations.waightRequestLastByte = vendor[device.vendor][device.model].waightRequestLastByte;
  }

  return deviceConfigurations;
}
