var OptionsCreator = require('../options-creator');
var Plugin = require('../plugin');

var DeviceConfigurations = function(port) {
  this.table = '';
  this.vendor = '';
  this.model = '';
  this.units = '';
  this.options = new OptionsCreator({});
  // this.strLineCode = '';
  // this.brkLineCode = '';
  // this.waightRequest = '';
  // this.waightRequestLastByte = '';
  // this.commonRequestBytes = [];
  // this.setzero = [];
  this.plugin = new Plugin(this);

  var portPath = port.path;
  var device = global.app.getDeviceByPath(portPath);
  if (device) {
    var options = new OptionsCreator(device.options);

    var plugin = new Plugin({
      table: device.table,
      vendor: device.vendor,
      model: device.model,
      units: device.units,
      options: options
    });

    this.table                  = device.table;
    this.vendor                 = device.vendor;
    this.model                  = device.model;
    this.units                  = device.units;
    this.options                = options;
    // this.strLineCode            = pluginConfig.symbols.strLineCode;
    // this.brkLineCode            = pluginConfig.symbols.brkLineCode;
    // this.waightRequest          = pluginConfig.symbols.waightRequest;
    // this.waightRequestLastByte  = pluginConfig.symbols.waightRequestLastByte;
    // this.commonRequestBytes     = pluginConfig.commands.commonRequestBytes;
    // this.setzero                = pluginConfig.commands.setzero;
    this.plugin                 = plugin;
  }
}

exports = module.exports = DeviceConfigurations;
