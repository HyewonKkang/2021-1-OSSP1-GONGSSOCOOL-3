const Router = require('express').Router;
const User = require('../models/User');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  login action
         */
        router.post('/login', async (req, res, next) => {
            try {
                let email = req.body.email;
                let password = req.body.password;
                const user = await User.findOne({
                    email: email,
                    password: password
                });
                if (user) {
                    req.session.user = {
                        id: user.id,
                        email: user.email,
                        birthday: user.birthday
                    };
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'Please checked you username or password'
                    });
                }

            } catch (error) {
                console.error(error);
                next(error);
            }
        });
        /**
         * register action
         */
        router.post('/register', async (req, res) => {
            let email = req.body.email;
            let password = req.body.password;
            let birthday = req.body.birthday;
            let user = await User.findOne({email: email});
            if (!user) {
                user = new User({
                    email,
                    password,
                    birthday
                });
                await user.save();
                res.json({
                    success: true
                });
            } else {
                res.json({
                    success: false,
                    msg: 'current email is exist'
                });
            }
        });

        /**
         * logout action
         */
        router.get('/logout', (req, res) => {
            delete req.session.user;
            res.send(200);
        });

        /**
         * check user login status
         */
        router.get('/loged', (req, res) => {
            if (req.session.user) {
                res.send(200);
            } else {
                res.send(401);
            }
        });

        app.use(router);
    }
};
