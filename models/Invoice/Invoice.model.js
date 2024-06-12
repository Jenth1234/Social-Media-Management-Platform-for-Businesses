const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { date } = require('joi');
// Schema của hóa đơn
var Invoice = new Schema({
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId,
        ref: 'ORGANIZATION'
    },
    PACKAGE_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Package'
    },
    LEVEL: { 
        type: Number
     
    }, 
    AMOUNT: {
        type: Number
    },
    // URL_PAYMENT:{
    //     type:String
    // },
    DATE_ISSUED: {
        type: Date,
        default: Date.now
    },
    DUE_DATE: {
        type: Date
    },
    PAID: {
        type: Boolean
    },
    ORDER_ID:{
        type:String
       
      
    }
    
});

module.exports = mongoose.model('Invoice', Invoice);
