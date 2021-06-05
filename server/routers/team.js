const Router = require('express').Router;
const User = require('../models/User');
const Team = require('../models/Team');
const TeamMember = require('../models/TeamMember');

module.exports = {
    init(app) {
        let router = new Router();
        /**
         *  create team
         */
        router.post('/', async (req, res, next) => {
            try {
                let user = req.session.user;
                let members = Array.isArray(req.body.teamMember) ? req.body.teamMember : [req.body.teamMember];
                let name = req.body.teamName;
                let isRight = true;
                for (let i = 0; i < members.length; i++) {
                    let email = members[i];
                    let find = await User.findOne({email: email});
                    if (!find) {
                        isRight = false;
                        res.status(403).send({msg: `member by email : ${email} not found`});
                        break;
                    }
                }
                if (isRight) {
                    members.unshift(user.email);
                    let team = new Team({
                        name: name,
                        owner: user.id
                    });
                    team = await team.save();
                    for (let i = 0; i < members.length; i++) {
                        let email = members[i];
                        let find = await User.findOne({email: email});
                        let member = new TeamMember({
                            tid: team.id,
                            uid: find.id
                        });
                        member = await member.save();
                    }
                    res.status(200).send({msg: 'create success'});
                }
            } catch (error) {
                res.status(500).send({msg: error.toString()});
            }
        });
        /**
         * get current user teams
         */
        router.get('/', (req, res) => {
        });

        app.use('/team', router);
    }
};
