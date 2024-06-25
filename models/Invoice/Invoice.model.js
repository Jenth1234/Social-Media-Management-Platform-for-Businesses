const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Organization', // Tham chiếu tới mô hình Organization
        required: true
    },
    // ORGANIZATION_NAME: {
    //     type: String,
    //     required: true
    // },
    PACKAGE_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Package', // Tham chiếu tới mô hình Package
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
    PAID: {
        type: Boolean,
        default: false
    },
    TYPE_ORDER:{
        type: String
    },
    ORDER_ID: {
        type: String,
        required: true
    },
    DATE_ISSUED: {
        type: Date,
        default: Date.now
    },
    THRU_DATE: {
        type: Date
    }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
