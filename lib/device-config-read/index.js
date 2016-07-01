var OptionsCreator = require('../options-creator');
var Plugin = require('../plugin');

var DeviceConfigurations = function(port) {
  var portPath = port.path;
  var config = global.app.config;
  var devices = config.devices;

  this.table = '';
  this.vendor = '';
  this.model = '';
  this.units = '';
  this.strLineCode = '';
  this.brkLineCode = '';
  this.waightRequest = '';
  this.waightRequestLastByte = '';
  this.commonRequestBytes = [];
  this.options = new OptionsCreator({});
  this.setzero = [];
  this.plugin = new Plugin();

  var device = null;
  for (var i=0; i < devices.length; i++) {
    var currentDevice = devices[i];
    if (currentDevice.path === portPath) {
      device = currentDevice;
      break;
    }
  }

  if (device) {
    var options = new OptionsCreator(device.options);

    var plugin = new Plugin({
      table: device.table,
      vendor: device.vendor,
      model: device.model,
      units: device.units,
      options: options
    });
    var pluginConfig = plugin.getConfig();

    this.table                  = device.table;
    this.vendor                 = device.vendor;
    this.model                  = device.model;
    this.units                  = device.units;
    this.options                = options;
    this.strLineCode            = pluginConfig.symbols.strLineCode;
    this.brkLineCode            = pluginConfig.symbols.brkLineCode;
    this.waightRequest          = pluginConfig.symbols.waightRequest;
    this.waightRequestLastByte  = pluginConfig.symbols.waightRequestLastByte;
    this.commonRequestBytes     = pluginConfig.commands.commonRequestBytes;
    this.setzero                = pluginConfig.commands.setzero;
    this.plugin                 = plugin;
  }
}

exports = module.exports = DeviceConfigurations;
