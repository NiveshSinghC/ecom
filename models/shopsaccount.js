const mongoose = require('mongoose');
const config = require('../config/database');


const ShopSchema = mongoose.Schema({
    ShopkeeperName: {
        type: String,
        required: true
    },
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    ShopName: {
        type: String,
        required: true
    },
    ShopAddress: {
        type: String,
        required: true
    },
    ContactNumber: {
        type: Number,
        required: true
    }


});

const Shopacc = module.exports = mongoose.model('woacc', ShopSchema, 'woacc');

module.exports.GetShopacc = function(Email, callback) {

    Shopacc.findOne({  'Email': '' + Email + ''  }, callback);

}
module.exports.comparePassword = function(candidatePassword, hash, callback){
    if(candidatePassword == hash){
        callback(null, true);        
    }else{
        callback('not match', null);
    }
}

module.exports.AddShop = function(newShop, callback) {
    newShop.save(callback);
}