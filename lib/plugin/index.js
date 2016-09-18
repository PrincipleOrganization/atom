var fs = require('fs');
var store = require('../store');

var Plugin = function(deviceConfig) {
  this.deviceConfig = deviceConfig;
}

Plugin.prototype.execute = function(message, callback) {
  var deviceConfig = this.deviceConfig;

  if (deviceConfig) {
    var table = deviceConfig.table;
    var vendor = deviceConfig.vendor;
    var model = deviceConfig.model;

    store.getPluginParams(table, vendor, model, function(error, execFunc, params) {
      var valid = false;

      var executeFunction = new Function('deviceConfig', 'deviceParams', 'message', 'callback', 'callback(false, null)');
      var getParams = new Function('return {}');

      if (error) {
        console.log(error);
      } else {
        valid = true;

        executeFunction = new Function('deviceConfig', 'deviceParams', 'message', 'callback', execFunc);
        getParams = new Function(params);
      }

      if (valid) {
        var deviceParams = getParams();

        executeFunction(deviceConfig, deviceParams, message, function(ready, processedData) {
          callback(ready, processedData);
        });
      } else {
        callback(false, null);
      }
    });
  }
}

exports = module.exports = Plugin;
