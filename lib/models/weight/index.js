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
    istring: {
      type: String,
      required: true
    },
    port: {
      type: String,
      require: true,
      index: true
    },
    value: {
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
    capped: {size: 4294967296, max: maxCount}
  });

  schema.statics.new = function(obj, callback) {
    var weight = new model(obj);
    weight.save(function(err, rec) {
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


/////////////////////////////////////////////
// *** RETHINKDB ***
else if (dbDriver.isRethinkDB()) {
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

  Weight.defineStatic('new', function(obj, callback) {
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
          var weight = new Weight(obj);
          weight.save(function(err, rec) {
            callback(err, rec);
          });
        }
      }
    );
  });

  Weight.defineStatic('findLast', function(params, callback) {
    var f = r.row("port").eq(params.port).and(r.row("date").le(params.date));
    if (params.stable.use) {
      f = f.and(r.row('stable').eq(params.stable.value));
    }

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

  Weight.defineStatic('clear', function(params, callback) {
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

  var model = Weight;
}

/////////////////////////////////////////////
// *** MONGODB ***

else if (dbDriver.isFlow()) {
  var flow = dbDriver.driver.db;

  var Weight = function() {}

  Weight.prototype.new = function(obj, callback) {
    flow.setDataFlow(obj.port, obj);

    if (callback) {
      callback(null, obj);
    }
  }

  Weight.prototype.findLast = function(params, callback) {
    var data = flow.getDataFlow(params.port);

    var resdata = generateResponseData(data, params);

    if (callback) {
      callback(null, resdata);
    }
  }

  Weight.prototype.clear = function(params, callback) {
    flow.clear();

    if (callback) {
      callback(null);
    }
  }

  var model = new Weight();
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
