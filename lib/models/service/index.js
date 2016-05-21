var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LAST_CLEANING_DATE_SID = 'service';

var schema = new Schema({
  lastCleaningDate: {
    type: Date
  },
  sid: {
    type: String,
    require: true,
    default: LAST_CLEANING_DATE_SID
  }
});

schema.statics.updateCleaningDate = function(newDate, callback(err)) {
  this.findOne({sid: LAST_CLEANING_DATE_SID}, function(err, data) {
    if (err) {
      callback(err);
    } else if (data) {
      data.lastCleaningDate = newDate;
      data.save(function(err) {
        callback(err);
      });
    } else {
      var rec = new Model({
        lastCleaningDate: newDate
      });
      rec.save(function(err) {
        callback(err);
      });
    }
  });
}

var Model = mongoose.model('CleaningDate', schema);

module.exports.CleaningDate = Model;
