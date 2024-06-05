
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Joi = require('joi');

var Package = new Schema({
    TITLE:{
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
    IS_ACTIVE:{
        type: Boolean
    },
    DISCOUNT:{
        type:Number
    },
     
   
});


module.exports = mongoose.model('Package', Package);