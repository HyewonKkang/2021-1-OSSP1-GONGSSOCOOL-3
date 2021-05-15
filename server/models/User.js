const mongoose = require('mongoose');
const uuid = require('node-uuid');

var UserSchema = new mongoose.Schema({
    userId: {
        type:String,
        require: true,
        unique: true,
    },
    email: {
        type:String,
        require: true,
        unique: true,
    },
    password: {
        type:String,
        require: true,
    },
    birthday: Date,
    phone: String,
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
