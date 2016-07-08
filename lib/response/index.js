var AtomError = require('../error');

var Response = function(data) {
  this.data = data;
  this.iserr = (data instanceof AtomError);
}

Response.prototype.send = function(res) {
  res.send({
    data: this.data,
    iserr: this.iserr
  });
}

exports = module.exports = Response;
