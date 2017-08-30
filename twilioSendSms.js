var twilio = require('twilio');

module.exports = twilioData => sms => new Promise(function(res, rej) {
	var client = twilio(twilioData.accountSid, twilioData.authToken);
  client.messages.create({
    from: twilioData.num,
    to: sms.to,
    body: sms.msg
  }, function(error, message) {
    if (error) return rej(error.message);
    res(sms);
  });
});

