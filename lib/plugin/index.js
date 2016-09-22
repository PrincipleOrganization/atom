var fs = require('fs');
var store = require('../store');

var Plugin = function(deviceConfig) {
  this.deviceConfig = deviceConfig;
  this.params = {};
}

Plugin.prototype.initParams = function(callback) {
  var deviceConfig = this.deviceConfig;
  var self = this;

  if (deviceConfig) {
    var table = deviceConfig.table;
    var vendor = deviceConfig.vendor;
    var model = deviceConfig.model;

    store.getPluginParams(table, vendor, model, function(error, ef, params) {
      var getParams = new Function('return {}');

      if (error) {
        console.log(error);
      } else {
        getParams = new Function(params);
      }

      self.params = getParams();

      callback();
    });
  }
}

Plugin.prototype.execute = function(port, message, callback) {
  var deviceConfig = this.deviceConfig;

  if (deviceConfig) {
    var table = deviceConfig.table;
    var vendor = deviceConfig.vendor;
    var model = deviceConfig.model;

    store.getPluginParams(table, vendor, model, function(error, execFunc, params) {
      var valid = false;

      var executeFunction = new Function('port', 'deviceConfig', 'deviceParams', 'message', 'callback', 'callback(false, null)');
      var getParams = new Function('return {}');

      if (error) {
        console.log(error);
      } else {
        valid = true;

        executeFunction = new Function('port', 'deviceConfig', 'deviceParams', 'message', 'callback', execFunc);
        getParams = new Function(params);
      }

      if (valid) {
        var deviceParams = getParams();

        executeFunction(port, deviceConfig, deviceParams, message, function(ready, processedData) {
          callback(ready, processedData);
        });
      } else {
        callback(false, null);
      }
    });
  }
}

exports = module.exports = Plugin;
