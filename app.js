var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var colors = require('colors');
var saveInDb = require('./mongoInsert');
var sendSms = require('./twilioSendSms');
var Either = require('minimal-either-monad-with-errors-handling');
var R = require('ramda');
var mongoXml = require('mongo-express-xml');


module.exports = function(mongoUri, twilioData, port){

app.use(express.static('public', {extensions: 'html'}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // x-www-form-urlencoded

var addDate = function(sms) {
  sms = R.clone(sms);
  sms.timestamp = Date.now();
  return sms;
}

var cl = sign => color => sms => {
  var d = new Date(sms.timestamp);
  var num = (sms.to || sms.from).match(/[^+1]\d*/)[0];
  var [date, time] = [d.toLocaleDateString(), d.toLocaleTimeString()];
  var msg = `[${sign}${num}, ${date}, ${time}] ${sms.msg}`;
  console.log(msg[color]);
  return sms;
};

// Send sms
//---------------------
app.post('/send-sms', function(req, res) {
  var sms = req.body;
  var verify = function(sms) {
    if (typeof sms !== 'object') throw "The sms needs to be an object";
    if (!sms.to || !sms.msg) throw "The sms requires <to> & <msg> properties";
    return sms;
  }
  Either.right(sms)
    .map(verify)
    .map(addDate)
    .chain(sendSms(twilioData))
    .then(saveInDb(mongoUri))
    .then(cl('->')('blue'))
    .then(x => res.send('Ok'))
    .catch(error => {
      console.log('Error: '.red + error.red);
      res.send('Error: ' + error);
    });
});

// Incoming sms
// ----------------------
app.post('/incoming-sms', function(req, res) {

  var trim = function(sms) {
    return {
      from: sms.From,
      msg: sms.Body,
      timestamp: Date.now()
    };
  }
  var sms = req.body;

  Either.right(sms)
    .map(trim)
    .chain(saveInDb(mongoUri))
    .then(cl('<-')('cyan'))
    .then(x => res.send('Ok'))
    .catch(error => {
      console.log('Error: '.red + error.red);
      res.send('Error: ' + error);
    });
});

app.get('/mongo-xml', mongoXml(mongoUri));

app.listen(port);
console.log("App started".green);
}
