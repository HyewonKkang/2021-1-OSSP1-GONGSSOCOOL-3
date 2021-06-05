const Router = require('express').Router;
const Notice = require('../models/Notice');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  Get Notice list
         */
        router.get('/', async (req, res) => {
            let list = await Notice.find({
                uid: req.session.user.id
            });
            res.json(list);
            console.log('get');
        });
        /**
         *  Create Notice
         */
        router.post('/', async (req, res) => {
            const notice = new Notice({
                ...req.body,
                uid: req.session.user.id
            });
            const data = await notice.save();
            res.json(data);
            console.log('createpost');
            // res.json(1);
        });
        /**
         *  Delete Notice
         */
        router.delete('/', async (req, res) => {
            const id = req.body.id;
            await Notice.deleteOne({
                id: id,
                uid: req.session.user.id,
            });
            res.json({
                id: id,
            });
            console.log('delete');
        });
        app.use('/notice', router);
    }
};