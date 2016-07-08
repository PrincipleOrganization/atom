var SocketServer = function(socketsConfig) {
  this.io = null;

  if (socketsConfig.use) {
    var opt = {
      rememberTransport: false,
      transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling']
    };
    this.io = require('socket.io', opt).listen(socketsConfig.port);
  }
  this.namespaces = [];
}

SocketServer.prototype.startSocket = function(port) {
  var socketsConfig = global.app.config.sockets;

  if (socketsConfig.use) {
    var namespace = this.io.of('/' + port.path);
    namespace.on('connection', function (socket) {
      if (socket) {
        console.log(`Connection on socket ${port.path}`);
      }
    });
    this.namespaces.push(namespace);
  }
}

SocketServer.prototype.emitOnSocket = function(port, message) {
  var namespace = this.findSocket(port);
  if (namespace) {
    namespace.emit(port.path, message);
  }
}

SocketServer.prototype.findSocket = function(port) {
  var namespace = null;
  for (var i=0; i < this.namespaces.length; i++) {
    var currentNamespace = this.namespaces[i];
    if (currentNamespace.name === '/' + port.path) {
      return currentNamespace;
    }
  }

  return null;
}

SocketServer.prototype.stopServer = function(callback) {
  var namespaces = this.namespaces;
  for (var index in namespaces) {
    var namespace = namespaces[index];
    namespace.destroy();
    this.namespaces.splice(this.namespaces.indexOf(namespace), 1);
  }

  this.io.close();
  
  if (callback) {
    callback();
  }
}

exports = module.exports = SocketServer;
