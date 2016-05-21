var fs = require('fs');

var Plugin = function(config) {
  this.config = config;
  this.file = null;
}

Plugin.prototype.connect = function() {
  var table = this.config.table;
  var vendor = this.config.vendor;
  var model = this.config.model;
  var path = `./plugins/${table}_${vendor}_${model}.aplug`;
  var fileExists = fs.existsSync(path);
  if (fileExists) {
    this.file = require(`../.${path}`);
  }
}

Plugin.prototype.execute = function(message) {
  if (this.file) {
    return this.file.execute(this.config, message);
  }
  return {};
}

module.exports = Plugin;
