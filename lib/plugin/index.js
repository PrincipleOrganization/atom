var fs = require('fs');

var Plugin = function(deviceConfig) {
  this.valid = false;
  this.deviceConfig = deviceConfig;

  this.executeFunction = function() {
    return {};
  };

  this.getConfig = function() {
    return {};
  };

  // TODO: move connect here, and rename to init
  init(this);
}

Plugin.prototype.isValid = function() {
  return this.valid;
}

Plugin.prototype.execute = function(message) {
  var self = this;
  if (self.isValid()) {
    return self.executeFunction(self.deviceConfig, message);
  }
  return {};
}

var init = function(plugin) {
  if (plugin.deviceConfig) {
    var table = plugin.deviceConfig.table;
    var vendor = plugin.deviceConfig.vendor;
    var model = plugin.deviceConfig.model;
    var path = `./plugins/${table}_${vendor}_${model}.aplug`;
    var fileExists = fs.existsSync(path);
    if (fileExists) {
      // TODO: drop require, use another mech
      file = require(`../.${path}`);

      plugin.executeFunction = file.execute;
      plugin.getConfig = file.config;

      plugin.valid = true;
    }
  }
}

exports = module.exports = Plugin;
