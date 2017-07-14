const mongoose = require('mongoose');
const config = require('../config/database');


const CustomerSchema = mongoose.Schema({
    name: {
        type: String
    },
    uidentity: {
        type: String
    },
    cart: {
        type: Array
    }


});

const cust = module.exports = mongoose.model('custs', CustomerSchema, 'customer');

module.exports.cust = function(name, callback) {

    cust.findOne({ 'name': '' + name + '' }, callback);

}

module.exports.addCustomer = function(newCustomer, callback) {
    newCustomer.save(callback);
}