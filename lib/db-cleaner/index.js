var Weight = require('../models/weight').Weight;

exports.clear = function(date) {
  if (date) {
    date = new Date();
  }

  var cleaningInterval = global._config.cleaningInterval;
  var cleaningDate = date.setSeconds(date.getSeconds() - cleaningInterval);

  clearWeight(cleaningDate);
}

function clearWeight(cleaningDate) {
  Weight.clear({date: cleaningDate});
}
