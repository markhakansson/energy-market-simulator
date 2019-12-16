const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const user = new Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    role: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    image: { data: Buffer, type: String },
});

/**
 * ASYNC salting and hashing password!
 */
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

/**
 * SYNC checking password!
 */
user.methods.comparePassword = function (candidatepass) {
    return bcrypt.compareSync(candidatepass, this.password);
    
};

module.exports = mongoose.model('User', user);
