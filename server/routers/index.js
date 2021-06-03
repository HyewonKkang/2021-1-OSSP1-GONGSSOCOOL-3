const schedule = require('./schedule');
const user = require('./user');
const calendar = require('./calendar');

module.exports = {
    init(app) {

        const whitelist = ['/login', '/register', '/loged'];

        app.all('*', (req, res, next) => {
            if (req.session.user) {
                next();
            } else {
                let find = whitelist.find(function(regexp) {
                    if (req.originalUrl.match(regexp)) {
                        return true;
                    }
                });
                if (find) {
                    next();
                } else {
                    res.status(401).json({msg: 'Need login'});
                }
            }
        });

        schedule.init(app);
        calendar.init(app);
        user.init(app);
    }
};
