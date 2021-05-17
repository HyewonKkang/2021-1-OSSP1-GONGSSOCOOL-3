const Router = require('express').Router;
const Schedule = require('../models/Schedule');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  Get schedule list
         */
        router.get('/', async (req, res) => {
            let list = await Schedule.find();
            res.json(list);
            console.log("get");
        });
        /**
         *  Create schedule
         */
        router.post('/', async (req, res) => {
            const schedule = new Schedule(req.body);
            const data = await schedule.save();
            res.json(data);
            console.log("create");
            // res.json(1);
        });
        /**
         *  Update schedule
         */
        router.put('/', async (req, res) => {
            await Schedule.updateOne({id: req.body.id}, req.body);
            res.send();
            console.log("put");
        });
        /**
         *  Delete schedule
         */
        router.delete('/', async (req, res) => {
            const id = req.body.id;
            const calendarId = req.body.calendarId;
            await Schedule.deleteOne({
                id: id,
                calendarId: calendarId
            });
            res.json({
                id: id,
                calendarId: calendarId
            });
            console.log("delete");
        });
        app.use('/schedule', router);
    }
};
