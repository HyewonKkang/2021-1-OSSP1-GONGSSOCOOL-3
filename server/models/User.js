const mongoose = require('mongoose');
const uuid = require('node-uuid');

var UserSchema = new mongoose.Schema({
    id: {
        type: String,
        default: function genUUID() {
            return uuid.v4();
        }
    },
    email: String,
    password: {
        type: String,
        select: false
    },
    birthday: String,
    Notification: String
});

const User = mongoose.model('user', UserSchema);
module.exports = User;