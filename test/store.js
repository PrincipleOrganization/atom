'use strict';

const chai = require('chai');
const expect = chai.expect;

const store = require('../lib/store');
const Plugin = require('../lib/plugin');
const AtomError = require('../lib/error');

describe('Store', function() {
  let db;
  let pluginStore;

  it('DB is created', function() {
    db = store.getDB();
  });

  it('plugin can be readen from store', function() {
    store.getPluginParams('weight', 'Ardruino', 'Uno', function(error, pluginParams) {
      expect(error).to.be.undefined;
      expect(pluginParams.executeFunction).to.be.a('string');
      expect(pluginParams.params).to.be.a('string');
    });
  });

  it('execute the specific plugin', function() {
    let plugin = new Plugin({
      table: 'weight',
      vendor: 'Ardruino',
      model: 'Uno'
    });

    plugin.execute(1, function(ready, processedData) {
      console.log('Data from plugin: ', processedData);
      expect(ready).to.be.true;
      expect(processedData).to.be.an('object');
      expect(processedData.weight).to.equal(20);
      expect(processedData.units).to.equal('kg');
    });
  });
})

// describe('Handler weight', function() {
//   it('write to database', function() {
//     const handler = require('../lib/handlers/weight.js');
//     const buffer = Buffer.from('test');
//
//     handler.writeToDatabase(port, buffer);
//   })
// });

describe('Sockets', function() {
  it('emit on socket', function() {
    var http = require('http');

    var opt = {
      rememberTransport: false,
      transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling']
    };
    var io = require('socket.io', opt).listen(4002);

    var path = '/dev/ttyUSB0';
    var namespace = io.of('/' + path);
    namespace.on('connection', function (socket) {
      if (socket) {
        console.log(`Connection on socket ${path}`);
      }
    });
    for (var i = 0; i < 150; i++) {
      namespace.emit(path, {
        date: new Date(),
        value: Math.random()
      });
    }
  })
});
