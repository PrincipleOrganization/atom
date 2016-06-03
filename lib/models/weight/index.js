var dbDriver = global.dbDriver;

if (dbDriver.isMongoDB()) { // MONGODB
  var mongoose = dbDriver.driver.db;
  var Schema = mongoose.Schema;

  var schema = new Schema({
    date: {
      type: Date,
      default: Date.now,
      index: true
    },
    istring: {
      type: String,
      required: true
    },
    port: {
      type: String,
      require: true,
      index: true
    },
    weight: {
      type: Number,
      default: 0
    },
    stable: {
      type: Boolean,
      default: false
    },
    units: {
      type: String
    },
    device: {
      vendor: String,
      model: String
    },
    readedBy: []
  }, {
    capped: {size: 4294967296}
  });

  schema.statics.findLast = function(params, callback) {
    var queryParams = {
      date: {
        $lte: params.date
      },
      port: params.port
    };

    if (params.stable.use) {
      queryParams.stable = params.stable.value;
    }

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

  var model = mongoose.model('Weight', schema);
}
else if (dbDriver.isRethinkDB()) { //RETHINKDB
  var thinky = dbDriver.driver.db;
  var type = thinky.type;
  var r = thinky.r;

  var Weight = thinky.createModel("Weight", {
    id: type.string(),
    date: type.date().default(r.now()),
    istring: type.string().required(),
    port: type.string().required(),
    weight: type.number().default(0),
    stable: type.boolean().default(false),
    units: type.string(),
    device: {
      vendor: type.string(),
      model: type.string()
    },
    readedBy: [type.string()]
  });

  Weight.ensureIndex("date");
  Weight.ensureIndex("port");

  var query = r.table(Weight.getTableName());

  Weight.defineStatic('findLast', function(params, callback) {
    query.orderBy({index: r.desc('date')})
      .filter(function(rec) {
        if (params.stable.use) {
          return rec('port').eq(params.port) && rec('date').le(params.date) && rec('stable').eq(params.stable.value);
        }
        return rec('port').eq(params.port) && rec('date').le(params.date);
      })
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

  Weight.defineStatic('clear', function(params, callback) {
    query.orderBy({index: r.desc('date')})
      .filter(function(rec) {
        if (params.port) {
          return rec('port').eq(params.port) && rec('date').le(params.date);
        }
        return rec('date').le(params.date);
      })
      .delete()
      .run()
      .then(function(result) {
        if (callback) {
          callback(null);
        }
      });
  });

  var model = Weight;
}



exports.Weight = model;


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
      weight: data.weight,
      stable: data.stable,
      units: data.units,
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
