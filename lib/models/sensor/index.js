var dbDriver = global.app.dbDriver;
var maxCount = global.app.config.db.maxCount;

/////////////////////////////////////////////
// *** MONGODB ***
if (dbDriver.isMongoDB()) {
  var mongoose = dbDriver.driver.db;
  var Schema = mongoose.Schema;

  var schema = new Schema({
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    port: {
      type: String,
      require: true,
      index: true
    },
    value: {
      type: String,
      default: '0'
    },
    device: {
      vendor: String,
      model: String
    },
    readedBy: []
  }, {
    capped: {size: 4294967296, max: maxCount}
  });

  schema.statics.new = function(obj, callback) {
    var sensor = new model(obj);
    sensor.save(function(err, rec) {
      callback(err, rec);
    });
  }

  schema.statics.findLast = function(params, callback) {
    var queryParams = {
      date: {
        $lte: params.date
      },
      port: params.port
    };

    this.findOne(queryParams, null, {sort: {date: -1}}, function(err, data) {
      var resdata = generateResponseData(data, params);
      callback(err, resdata);
    });
  };

  schema.statics.clear = function(params, callback) {
    var cond = {date: {$lt: params.date}};
    if (params.port) {
      cond.port = params.port;
    }
    this.remove(cond, function(err) {
      if (callback) {
        callback(err);
      }
    });
  }

  var model = mongoose.model('Sensor', schema);
}


/////////////////////////////////////////////
// *** RETHINKDB ***
else if (dbDriver.isRethinkDB()) {
  var thinky = dbDriver.driver.db;
  var type = thinky.type;
  var r = thinky.r;

  var Sensor = thinky.createModel("Sensor", {
    id: type.string(),
    date: type.date().default(r.now()),
    port: type.string().required(),
    value: type.string().default(0),
    device: {
      vendor: type.string(),
      model: type.string()
    },
    readedBy: [type.string()]
  });

  Sensor.ensureIndex("date");
  Sensor.ensureIndex("port");

  var query = r.table(Sensor.getTableName());

  Sensor.defineStatic('new', function(obj, callback) {
    query.count()
      .run()
      .then(function(count) {
        if (count >= maxCount) {
          query.orderBy({index: r.desc('date')})
            .nth(1)
            .update(obj)
            .run()
            .then(function(result) {
              callback(null, obj);
            });
      } else {
        var sensor = new Sensor(obj);
        sensor.save(function(err, rec) {
          callback(err, rec);
        });
      }
    });
  });

  Sensor.defineStatic('findLast', function(params, callback) {
    var f = r.row("port").eq(params.port).and(r.row("date").le(params.date));

    query.orderBy({index: r.desc('date')})
      .filter(f)
      .limit(1)
      .run()
      .then(function(result) {
        var resdata = null;
        if (result.length != 0) {
          var data = result[0];
          resdata = generateResponseData(data, params);
        }
        callback(null, resdata);
      });
  });

  Sensor.defineStatic('clear', function(params, callback) {
    var f = r.row('date').le(params.date);
    if (params.port) {
      f = f.and(r.row('port').eq(params.port));
    }

    query.orderBy({index: r.desc('date')})
      .filter(f)
      .delete()
      .run()
      .then(function(result) {
        if (callback) {
          callback(null);
        }
      });
  });

  var model = Sensor;
}

exports = module.exports = model;

function generateResponseData(data, params) {
  var resdata = null;
  if (data) {
    resdata = {
      port: data.port,
      date: {
        year: data.date.getFullYear(),
        month: data.date.getMonth() + 1,
        day: data.date.getDate(),
        hour: data.date.getHours(),
        minutes: data.date.getMinutes(),
        seconds: data.date.getSeconds(),
        miliseconds: data.date.getMilliseconds()
      },
      device: data.device,
      isodate: data.date,
      reqisodate: params.date,
      value: data.value,
      readedBy: data.readedBy
    };

    if (params.reader) {
      var readers = data.readedBy;
      var readerFounded = false;
      for (var i=0; i < readers.length; i++) {
        if (readers[i] === params.reader) {
          readerFounded = true;
          break;
        }
      }

      if (!readerFounded) {
        data.readedBy.push(params.reader);
        data.save(function(err) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  }

  return resdata;
}
