const Router = require('express').Router;
const Schedule = require('../models/Schedule');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  Get schedule list
         */
        router.get('/', async (req, res) => {
            let list = await Schedule.find({
                uid: req.session.user.id
            });
            res.json(list);
        });
        router.get('/team_schedule', async (req, res) => {
            let list = await Schedule.find();
            res.json(list);
        });
        /**
         *  Create schedule
         */
        router.post('/', async (req, res) => {
            const schedule = new Schedule({
                ...req.body,
                uid: req.session.user.id
            });
            const data = await schedule.save();
            res.json(data);
            // res.json(1);
        });
        router.post('/team_schedule', async (req, res) => {
            const schedule = new Schedule(req.body);
            const data = await schedule.save();
            res.json(data);
            // res.json(1);
        });
        /**
         *  Update schedule
         */
        router.put('/', async (req, res) => {
            await Schedule.updateOne({
                id: req.body.id,
                uid: req.session.user.id
            }, req.body);
            res.send();
        });
        /**
         *  Delete schedule
         */
        router.delete('/', async (req, res) => {
            const id = req.body.id;
            const calendarId = req.body.calendarId;
            await Schedule.deleteOne({
                id: id,
                uid: req.session.user.id,
                calendarId: calendarId
            });
            res.json({
                id: id,
                calendarId: calendarId
            });
        });
        app.use('/schedule', router);
    }
};
