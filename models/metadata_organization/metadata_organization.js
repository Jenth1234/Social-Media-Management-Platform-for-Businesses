const { date } = require('joi');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var METADATA_ORGANIZATION = new Schema({
   
    ORGANIZATION_ID:{
        type:Schema.Types.ObjectId,
        ref: 'ORGANIZATION'
    },
    
   
        PACKAGE_ID:{
            type:Schema.Types.ObjectId,
            ref: 'Package'
        },
    
        NUMBER_OF_PRODUCT: {
            type: Number
        },
        NUMBER_OF_COMMENT: {
            type: Number
        },
        ACTIVE_FROM_DATE: {
            type: Date, 
            default: Date.now
        },
        ACTIVE_THRU_DATE: {
            type: Date
        }
   
    
});
module.exports = mongoose.model("METADATA_ORGANIZATION", METADATA_ORGANIZATION);
