const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const user = new Schema({
    role: { type: String, required: true },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() }
});

user.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

user.methods.comparePassword = function (candidatepass, res) {
    bcrypt.compare(candidatepass, this.password, function (err, isMatch) {
        if (err) return res(err);
        res(null, isMatch);
    });
};

module.exports = mongoose.model('User', user);
