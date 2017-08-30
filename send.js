// Call this script directly in the terminal. You need to provide the
// destination phone number and the message as arguments.

var request = require('request');
var colors = require('colors');

var port = 3002;

var httpPostReq = port => obj => new Promise(function(res, rej) {
  request.post({
      url: `localhost:${port}/send-sms`,
      form: obj
    },
    function(err, hRes, body) {
      if (err) return rej(err.code);
      if (hRes.statusCode != 200) return rej('statusCode: ' + hRes.statusCode);
      res(body);
    });
});

var sms = {
  to: process.argv[2],
  msg: process.argv[3]
};

var cl = function(x) {
  console.log(x);
  return x;
}
var clRed = function(x) {
  console.log(x.red);
  return x;
}

//------------------------------------------------------------
httpPostReq(port)(sms).then(cl).catch(clRed);
//------------------------------------------------------------
