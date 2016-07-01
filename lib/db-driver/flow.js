var Flow = function() {
  this.db = new FlowController();
}

Flow.prototype.start = function(callback) {
  if (this.db && callback) {
    callback();
  }
};

Flow.prototype.close = function(callback) {
  if (callback) {
    callback();
  }
}

var FlowController = function() {
  this.dataFlows = [];
}

FlowController.prototype.newDataFlow = function(serialPort) {
  var dataFlow = new DataFlow(serialPort);
  this.dataFlows.push(dataFlow);

  return dataFlow;
}

FlowController.prototype.getDataFlow = function(serialPort) {
  var data;

  for (var index in this.dataFlows) {
    var currentDataFlow = this.dataFlows[index];
    if (currentDataFlow.serialPort == serialPort) {
      data = currentDataFlow.getData();
      break;
    }
  }

  return data;
}

FlowController.prototype.setDataFlow = function(serialPort, data) {
  var dataFlowExists = false;

  for (var index in this.dataFlows) {
    var currentDataFlow = this.dataFlows[index];
    if (currentDataFlow.serialPort == serialPort) {
      currentDataFlow.setData(data);
      dataFlowExists = true;
      break;
    }
  }

  if (!dataFlowExists) {
    var dataFlow = this.newDataFlow(serialPort);
    dataFlow.setData(data);
  }
}

FlowController.prototype.clear = function() {
  // TODO: clear for specific serial-port
  this.dataFlows = [];
}


var DataFlow = function(serialPort) {
  this.serialPort = serialPort;
  this.data = {};
}

DataFlow.prototype.getData = function(data) {
  return this.data;
}

DataFlow.prototype.setData = function(data) {
  this.data = data;
}

exports = module.exports = Flow;
