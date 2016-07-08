///////////////////////////////////////////////
// Errors:
//  1. Invalid comPort name ${comName}
//  2. Can not open port ${comName}
//  3. Can not get all ports
//  4. Can not close port ${comName}
//  5. Can not execute command on port ${comName}
//  6. Can not set weight ${comName} to zero
//  7. Serial port ${comName} is not open
//  8. At least one serial port must be opened
//  9. Can't find any working configuration
// 10. Can't find any device in configuration

var errors = {
  _1: 'Invalid serial-port name',
  _2: `Can't open serial-port`,
  _3: `Can't get all serial-ports`,
  _4: `Can't close serial-port`,
  _5: `Can't execute command on serial-port`,
  _6: `Can't set weight on serial-port to zero`,
  _7: 'Serial-port is not open',
  _8: 'At least one serial port must be opened',
  _9: `Can't find any working configuration`,
  _10: `Can't find any device in configuration`
}

var AtomError = function(code, err) {
  this.code = code;
  this.text = errors[`_${code}`];
  this.node_err = (err) ? err : '';

  console.log(`ERR=${this.code} ${this.text}`);
  console.log(`NODE_ERR=${this.node_err}`);
}

exports = module.exports = AtomError;
