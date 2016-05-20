var S = require('string');

module.exports.parseDate = function(query) {
  var currentDate = new Date();

  var year =    getDateParam(query, 'Y', currentDate);
  var month =   getDateParam(query, 'M', currentDate);
  var day =     getDateParam(query, 'D', currentDate);
  var hour =    getDateParam(query, 'h', currentDate);
  var minute =  getDateParam(query, 'm', currentDate);
  var second =  getDateParam(query, 's', currentDate);

  var date = new Date(year, month -1, day, hour, minute, second, 0);
  if (date) {
    return date;
  } else {
    return currentDate;
  }
}

module.exports.parseCommand = function(cmd) {
  var bytes = [];

  if (!S(cmd).isEmpty()) {
    bytes = S(cmd).parseCSV('b');
  }

  if (bytes) {
    bytes.splice(0, 1);
    for (var i=0; i < bytes.length; i++) {
      bytes[i] = Number(bytes[i]);
    }
  }

  return bytes;
}


function getDateParam(query, field, currentDate) {
  if (query[field]) {
    return query[field];
  }

  if (field === 'Y') {
    return currentDate.getFullYear();
  } else if (field === 'M') {
    return currentDate.getMonth() + 1;
  } else if (field === 'D') {
    return currentDate.getDate();
  } else if (field === 'h') {
    return 23;
  } else if (field === 'm') {
    return 59;
  } else if (field === 's') {
    return 59;
  }
}
