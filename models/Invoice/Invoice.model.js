const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        type: Number, 
        required: true 
    }, 
    AMOUNT: {
        type: Number
    },
    DATE_ISSUED: {
        type: Date,
        default: Date.now
    },
    DUE_DATE: {
        type: Date
    },
    PAID: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Invoice', Invoice);
