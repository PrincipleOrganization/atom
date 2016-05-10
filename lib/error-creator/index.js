///////////////////////////////////////////////
// Errors:
//  1. Invalid comPort name ${comName}
//  2. Can not open port ${comName}
//  3. Can not get all ports
//  4. Can not close port ${comName}
//  5. Can not execute command on port ${comName}


module.exports = function(code, text, err) {
  var error = {
    code: code,
    text: text,
    node_err: (err) ? err : ''
  };

  console.log(`ERR=${code} ${text}`);
  console.log(`NODE_ERR=${err}`);

  return error;
}
