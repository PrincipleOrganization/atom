var DataStream = function(portName) {
  this.portName = portName;
  this.data = '';
}

DataStream.prototype.addToStream = function(data) {
  this.data = this.data + data;
}

DataStream.prototype.clear = function() {
  this.data = '';
}

exports.DataStream = DataStream;

function findDataStream(portName) {
  var dataStream = null;

  for (var i=0; i < global.dataStreams.length; i++) {
    var currentDataStream = global.dataStreams[i];
    if (currentDataStream.portName === portName) {
      dataStream = currentDataStream;
      break;
    }
  }

  if (!dataStream) {
    dataStream = new DataStream(portName);
    addNewDataStream(dataStream);
  }

  return dataStream;
}

exports.findDataStream = findDataStream;

exports.initDataStreams = function() {
  global.dataStreams = [];
}

function addNewDataStream(dataStream) {
  global.dataStreams.push(dataStream);
}

exports.addNewDataStream = addNewDataStream;

exports.clearDataStream = function(portName) {
  var dataStream = findDataStream(portName);
  dataStream.clear();
}

exports.updateDataStream = function(portName, data) {
  var dataStream = findDataStream(portName);
  dataStream.addToStream(data);
}

exports.getDataFromDataStream = function(portName) {
  var dataStream = findDataStream(portName);
  return dataStream.data;
}
