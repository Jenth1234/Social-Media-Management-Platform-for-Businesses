// Trong file package.model.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { date, boolean } = require('joi');
const { type } = require('os');
var Package = new Schema({
    TITLE: {
        type: String
    },
    LEVEL: {
        type: Number
    },
    COST: {
        type: Number
    },
    NUMBER_OF_PRODUCT: {
        type: Number
    },
    NUMBER_OF_COMMENT: {
        type: Number
    },
    DESCRIPTION: {
        type: String
    },
    IS_ACTIVE: {
        type: Boolean
    },
    MONTH : {
        type: Number
    },
    DISCOUNT: {
        type: Number
    }, 
    IS_DELETE:{
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('Package', Package);
