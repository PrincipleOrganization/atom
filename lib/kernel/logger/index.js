var sql = require('mssql');

var config = {
    user: 'sa',
    password: 'SaSa1594826',
    server: 'MIR-1CKKU',
    database: 's8scales',
    options: {encrypt: false}
}

var ipAddr = '127.0.0.1';

module.exports.write = function(port, time, weight) {
  writeToDB(false, port, time, weight, 'N', null);
}

module.exports.writeClient = function(port, time, weight, recType, base) {
  writeToDB(true, port, time, weight, recType, base);
}

function writeToDB(isClient, port, time, weight, recType, base) {
  var device = global.app.getDeviceByPath(port);
  var scales = device.name;

  var query = `INSERT INTO logs (Scales, TimeEvent, Weight, IPAddress) VALUES ($scales, $time, $weight, $ipAddr)`;
  if (isClient) {
    query = `INSERT INTO logs (Scales, TimeEvent, Weight, IPAddress, RecType, Base) VALUES ($scales, $time, $weight, $ipAddr, $recType, $base)`;
  }

  sql.connect(config, function(err) {
    if (err) {
      console.log(err);
    } else {
      var transaction = new sql.Transaction();
      transaction.begin(function(err) {
        if (err) {
          console.log(err);
        } else {
          var request = new sql.Request(transaction);
          request.query(query, function(err, recordset) {
            if (err) {
              console.log(err);
            } else {
              transaction.commit(function(err, recordset) {
                if (process.vars.env === 'development') {
                  console.log('Transaction commited.');
                }
              });
            }
          });
        }
      });
    }
  });
}
