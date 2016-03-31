var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.mongoose.model('User', db.userSchema);

db.userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

db.userSchema.methods.hashPassword = function(model, next) {
  var cipher = Promise.promisify(bcrypt.hash);
  console.log('this password is ' + model.password);
  return cipher(model.password, null, null).bind(this)
    .then(function(hash) {
      console.log(hash);
      model.password = hash;
      next();
    });
};

db.userSchema.pre('save', function(next, done) {
  console.log('calling pre save');
  db.userSchema.methods.hashPassword(this, next);

});


module.exports = User;
