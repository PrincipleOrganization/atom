var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  isrting: {
    type: String,
    required: true
  },
  port: {
    type: String,
    require: true
  },
  weight: {
    type: Number,
    default: 0
  }
});

schema.statics.findLast = function(params, callback) {
  this.findOne({date: {$lte: params.date}, port: params.port}, null, {sort: {date: -1}}, function(err, data) {
    var resdata = data;
    if (data) {
      resdata = {
        port: data.port,
        date: {
          year: data.date.getFullYear(),
          month: data.date.getMonth(),
          day: data.date.getDate(),
          hour: data.date.getHours(),
          minutes: data.date.getMinutes(),
          seconds: data.date.getSeconds(),
          miliseconds: data.date.getMilliseconds()
        },
        isodate: data.date,
        reqisodate: params.date,
        weight: data.weight
      };
    }
    callback(err, resdata);
  });
};

exports.Weight = mongoose.model('Weight', schema);
