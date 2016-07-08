var IntervalCommand = function(port, intervalID) {
  this.port = port.path;
  this.id = intervalID;
}

exports.initIntervalCommands = function(app) {
  app.intervalCommands = [];
}

exports.newIntervalCommand = function(port, functionCmd) {
  var isInterval = portHasInterval(port);
  if (isInterval) {
    deleteInterval(port);
  }

  if (global.app.config.intervalCommands.use) {
    var intervalID = setInterval(functionCmd, global.app.config.intervalCommands.interval);
    var intervalCommand = new IntervalCommand(port, intervalID);
    global.app.intervalCommands.push(intervalCommand);
  }
}

function deleteInterval(port) {
  var intervals = global.app.intervalCommands;
  for (var i=0; i < intervals.length; i++) {
    var interval = intervals[i];
    if (interval.port === port.path) {
      clearInterval(interval.id);
      break;
    }
  }
}

exports.clearInterval = deleteInterval;

exports.clearAllIntervals = function(callback) {
  var intervals = global.app.intervalCommands;
  for (var i=0; i < intervals.length; i++) {
    var interval = intervals[i];
    clearInterval(interval.id);
  }

  if (callback) {
    callback();
  }
}

function portHasInterval(port) {
  var intervals = global.app.intervalCommands;
  for (var i=0; i < intervals.length; i++) {
    var interval = intervals[i];
    if (interval.port === port.path) {
      return true;
    }
  }

  return false;
}
