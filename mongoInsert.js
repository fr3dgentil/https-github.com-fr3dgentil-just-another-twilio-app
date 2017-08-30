var MongoClient = require('mongodb').MongoClient;
var R = require('ramda');

module.exports = uri => sms => new Promise(function(res, rej) {
  MongoClient.connect(uri, function(err, db) {
    db.collection('sms').insertOne(R.clone(sms), function(err, result) {
      if (err) return rej(err);
      res(sms);
    });
    db.close();
  });
});
