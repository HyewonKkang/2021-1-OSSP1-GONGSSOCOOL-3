const mongoose = require('mongoose');
const uuid = require('node-uuid');
/**
 *
 */

var NoticeSchema = new mongoose.Schema({
    // ID
    id: {
        type: String,
        default: function genUUID() {
            return uuid.v4();
        }
    },
    uid: String,
    context: String
});

const Notice = mongoose.model('notice', NoticeSchema);
module.exports = Notice;