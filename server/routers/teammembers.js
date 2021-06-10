const Router = require('express').Router;
const TeamMember = require('../models/TeamMember');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  Get teamMembers list
         */
        router.get('/', async (req, res) => {
            let list = await TeamMember.find();
            res.json(list);
            console.log('getMembers');
        });
        app.use('/teammembers', router);
    }
};