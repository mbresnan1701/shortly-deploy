var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.mongoose.model('User', db.userSchema);

db.userSchema.methods.comparePassword = function(model, attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, model.password, function(err, isMatch) {
    callback(isMatch);
  });
};

db.userSchema.methods.hashPassword = function(model, next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(model.password, null, null).bind(this)
    .then(function(hash) {
      model.password = hash;
      next();
    });
};

db.userSchema.pre('save', function(next, done) {
  db.userSchema.methods.hashPassword(this, next);
});


module.exports = User;
