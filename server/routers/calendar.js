const Router = require('express').Router;
const Calendar = require('../models/Calendar');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  Get schedule list
         */
        router.get('/', async (req, res) => {
            let list = await Calendar.find({
                uid: req.session.user.id
            });
            res.json(list);
            console.log("get cal");
        });
        /**
         *  Create schedule
         */
        router.post('/', async (req, res) => {
            const calendar = new Calendar({
                ...req.body,
                uid: req.session.user.id
            });
            const data = await calendar.save();
            res.json(data);
            console.log("create cal");
            // res.json(1);
        });
        /**
         *  Update schedule
         */
        /**router.put('/', async (req, res) => {
            await Calendar.updateOne({id: req.body.id}, req.body);
            res.send();
            console.log("put");
        });
        */
        /**
         *  Delete schedule
         */
        // router.delete('/', async (req, res) => {
        //     const id = req.body.id;
        //     await Calendar.deleteOne({
        //         id: id,
        //         uid: req.session.user.id,
        //     });
        //     res.json({
        //         id: id,
        //     });
        //     console.log("delete");
        // });
        app.use('/calendar', router);
    }
};