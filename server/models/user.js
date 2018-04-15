const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define our model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String 
});

//create model class and export
const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;