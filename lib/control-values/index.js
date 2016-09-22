module.exports.update = function(port, value) {
  var controlValues = global.app.controlValues;

  if (controlValues[port] == undefined) {
    controlValues[port] = [];
  }

  controlValues[port].push(value);

  if (controlValues[port].length > 5) {
    controlValues[port].shift(value);
  }
}
