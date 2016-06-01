var SocketServer = function() {
  var socketsConfig = global._config.sockets;

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
  var socketsConfig = global._config.sockets;

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

module.exports = SocketServer;
