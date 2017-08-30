var app = require('./app');

var mongoUri = '';

var twilioData = {
  num: '',
  accountSid: '',
  authToken: ''
}

app(mongoUri, twilioData, 3002);
