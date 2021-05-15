const schedule = require('./schedule');

module.exports = {
    init(app) {
        schedule.init(app);
    },
};
