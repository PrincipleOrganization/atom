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
  }
});

exports.Weight = mongoose.model('Weight', schema);
