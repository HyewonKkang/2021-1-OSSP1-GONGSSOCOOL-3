const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');
mongoose.connect(`mongodb://${dbConfig.HOST}/${dbConfig.DATABASE}`).then(() => {
    console.log('Connect mongodb success!');
});
module.exports = {
    init() {},
};
