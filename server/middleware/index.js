const path = require('path');
const express = require('express');
const session = require('express-session');
const NedbStore = require('nedb-session-store')(session);

module.exports = {
    /**
     * @param  {*|express} app
     */
    init: function(app) {

        app.use(session({
            secret: 'secret-key',
            name: 'sid',
            cookie: {maxAge: 6000000},
            resave: false,
            saveUninitialized: true,
            store: new NedbStore({
                filename: path.join(__dirname, '../.ignore/nedb_session_file.db')
            })
        }));

        app.use(express.urlencoded({extended: true}));

    }
};
