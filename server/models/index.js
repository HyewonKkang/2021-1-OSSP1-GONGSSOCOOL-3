const mongoose = require('mongoose');
const dbConfig = require('../configs/db.config');
mongoose.connect(`mongodb://${dbConfig.HOST}/${dbConfig.DATABASE}`,{
    dbName: 'tuical',
},(error)=>{
    if(error){
        console.log('Connect mongodb failed!');
    }else{
        console.log('Connect mongodb success!');
    }
});

module.exports = {
    init() {}
};
