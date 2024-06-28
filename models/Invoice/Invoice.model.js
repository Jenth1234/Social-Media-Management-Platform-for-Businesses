const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    PACKAGE_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Package', 
        required: true
    },
    PACKAGE_NAME: {
        type: String,
        required: true
    },
    NUMBER_OF_PRODUCT: {
        type: Number,
        required: true
    },
    NUMBER_OF_COMMENT: {
        type: Number,
        required: true
    },
    LEVEL: {
        type: Number,
        required: true
    },
    COST: {
        type: Number,
        required: true
    },
    AMOUNT: {
        type: Number,
        required: true
    },
    MONTH: {
        type: Number,
        required: true
    },
    DISCOUNT: {
        type: Number,
        required: true
    },
    URL: {
        type: String,
        required: true
    },
    PAID: {
        type: Boolean,
        default: false
    },

    URL: {
        type:String,
        require:true
    },
    TYPE_ORDER:{

        type: String
    },
    APP_TRANS_ID: {
        type: String,
        required: true
    },
    ORDER_ID: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    THRU_DATE: {
        type: Date
    }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
