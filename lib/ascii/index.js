var isAscii = require('is-ascii');

exports.generateFromDecimalArray = function(array) {
  var result = '';
  for (var i=0; i < array.length; i++) {
    result = result + String.fromCharCode(array[i]);
  }
  return isAscii(result) ? result : '';
}
