const mongoose = require('mongoose');
const uuid = require('node-uuid');
/**
 *
 */

var ScheduleSchema = new mongoose.Schema({
    // ID
    id: {
        type: String,
        default: function genUUID() {
            return uuid.v4();
        }
    },
    uid: String,
    calendarId: String,
    isAllDay: Boolean,
    title: String,
    location: String,
    state: String,
    start: Date,
    end: Date,
    raw: {
        importance: Number,
        duration: Number,
        times: Number,
        memo: String,
        hasToOrCc: Boolean,
        hasRecurrenceRule: Boolean,
        location: String,
        class: String, // public or 'private'
        creator: {
            name: String,
            avatar: String,
            company: String,
            email: String,
            phone: String
        }
    }
});

const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;
