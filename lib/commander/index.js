var IntervalCommand = function(port, intervalID) {
  this.port = port.path;
  this.id = intervalID;
}

exports.initIntervalCommands = function() {
  if (global._config.intervalCommands.use) {
    global.intervalCommands = [];
  }
}

exports.newIntervalCommand = function(port, functionCmd) {
  var isInterval = portHasInterval(port);
  if (isInterval) {
    clearInterval(port);
  }

  if (global._config.intervalCommands.use) {
    var intervalID = setInterval(functionCmd, global._config.intervalCommands.interval);
    var intervalCommand = new IntervalCommand(port, intervalID);
    global.intervalCommands.push(intervalCommand);
  }
}

function clearInterval(port) {
  var intervals = global.intervalCommands;
  for (var i=0; i < intervals.length; i++) {
    var interval = intervals[i];
    if (interval.port === port.path) {
      clearInterval(interval.id);
      break;
    }
  }
}

exports.clearInterval = clearInterval;

function portHasInterval(port) {
  var intervals = global.intervalCommands;
  for (var i=0; i < intervals.length; i++) {
    var interval = intervals[i];
    if (interval.port === port.path) {
      return true;
    }
  }

  return false;
}
