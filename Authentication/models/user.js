// db engine
const mongoose=require('mongoose');
// hashing
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config').get(process.env.NODE_ENV);
const salt=10;


const userSchema=mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        maxlength: 30
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 150
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    confirm_password: {
        type: String,
        required: true,
        minlength: 8
    },
    token: {
        type: String,
    }
});

// hash password
userSchema.pre('save', function(next) {
    var user=this;

    if(user.isModified('password')) {
        bcrypt.genSalt(salt, function(err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password=hash;
                user.confirm_password=hash;
                next();
            });
        });
    } else {
        next();
    }
});

// password comparation
userSchema.methods.comparepassword=function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

// generato token when user login
userSchema.methods.generateToken=function(callback) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), config.SECRET);

    user.token = token;
    user.save(function(err, user) {
        if(err) return callback(err);
        callback(null, user);
    });
}

// find by token
userSchema.statics.findByToken=function(token, callback) {
    var user=this;

    jwt.verify(token, config.SECRET, function(err, decode) {
        user.findOne({"_id":decode, "token":token}, function(err, user) {
            if(err) return callback(err);
            callback(null, user);
        });
    });
}

// delete token
userSchema.methods.deleteToken=function(token, callback) {
    var user=this;

    user.update({$unset: {token: 1}}, function(err, user) {
        if(err) return callback(err);
        callback(null, user);
    });
}

module.exports = mongoose.model('User', userSchema);