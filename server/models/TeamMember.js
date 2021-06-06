const mongoose = require('mongoose');
const uuid = require('node-uuid');
/**
 *
 */

const TeamMemberSchema = new mongoose.Schema({
    id: {
        type: String,
        default: function genUUID() {
            return uuid.v4();
        }
    },
    tname: String,
    tid: String,
    uid: String,
    createAt: {
        type: Date,
        default: function() {
            return new Date();
        }
    }
});

const TeamMember = mongoose.model('team_member', TeamMemberSchema, 'team_members');

module.exports = TeamMember;
