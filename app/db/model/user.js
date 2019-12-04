const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const user = new Schema({
    username: String,
    password: String,
    timestamp: { type: Date, default: Date.now() },
});

user.pre('save', (next) => {
    let user = this;
    if(!user.isModified('password')) return next(); 
  
    bcrypt.genSalt(10, (err, salt) => {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) return next(err);
  
        user.password = hash;
        next();
      });
    });
  
  });
  
  user.methods.comparePassword = (candidatePassword, cb) => {
      bcrypt
  }

module.exports = mongoose.model('User', user);