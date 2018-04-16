const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//define our model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String 
});

//on save hook bcrypt password
//before saving run this function
userSchema.pre('save', function(next) {
    //get access to the user model
    const user = this;
    //generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {return next(err);}
        //hash(encrypt) password using salt
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {return next(err);}
            //override plain text password with encrypted one
            user.password = hash;
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    })    
}

//create model class and export
const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;