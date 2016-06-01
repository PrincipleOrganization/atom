var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  isrting: {
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
  console.log(params);

  this.findOne(queryParams, null, {sort: {date: -1}}, function(err, data) {
    var resdata = data;
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

exports.Weight = mongoose.model('Weight', schema);
