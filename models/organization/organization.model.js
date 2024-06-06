const { date } = require('joi');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ORGANIZATION = new Schema({
    ORGANIZATION_NAME: {
        type: String,
    },
    ORGANIZATION_EMAIL: {
        type: String,
    },
    ORGANIZATION_PHONE: {
        type: String,
    },
    ORGANIZATION_ACTIVE: {
        TIME: {
            type: Date
        },
        CHECK: {
            type: Boolean
        },
        ACTIVE_BY_USER_ID: {
            type: Schema.Types.ObjectId
        }
    },
    OBJECT_APPROVED: {
        TIME: {
            type: Date
        },
        CHECK: {
            type: Boolean
        },
        APPROVED_BY_USER_ID: {
            type: Schema.Types.ObjectId
        }
    },

    PACKAGE:{
        PACKAGE_ID:{
            type:Schema.Types.ObjectId,
            ref: 'Package'
        },
        LEVEL: {
            type: Number
        },
        NUMBER_OF_PRODUCT: {
            type: Number
        },
        NUMBER_OF_COMMENT: {
            type: Number
        },
        ACTIVE_FROM_DATE:{
            type:date
        },
        ACTIVE_THRU_DATE:{
            type:date
        }
    }
    REGISTER_DATE: {
        type: Date,
    },

});

module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);
