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
    // 分类ID
    calendarId: String,
    // 是否全天
    isAllDay: Boolean,
    // 标题
    title: String,
    // 地址
    location: String,
    // 状态
    state: String,
    // 开始时间
    start: Date,
    // 结束时间
    end: Date,
    // 其它信息
    raw: {
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
