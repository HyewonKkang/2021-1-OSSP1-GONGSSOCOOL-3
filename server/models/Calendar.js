const mongoose = require('mongoose');
const uuid = require('node-uuid');
/**
 *
 */

var CalendarSchema = new mongoose.Schema({
    // ID
    id: {
        type: String,
        unique: true
        // default: function genUUID() {
        //     return uuid.v4();
        // }
    },
    uid: String,
    name : String,
    checked: Boolean,
    color: String,
    bgColor: String,
    dragBgColor: String,
    borderColor: String,
});

const Calendar = mongoose.model('calendar', CalendarSchema);

module.exports = Calendar;