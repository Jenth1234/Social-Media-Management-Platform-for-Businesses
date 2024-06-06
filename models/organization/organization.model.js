const { date } = require('joi');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ORGANIZATION = new Schema({
    ORGANIZATION_NAME: {
        type: String
    },
    ORGANIZATION_EMAIL: {
        type: String
    },
    ORGANIZATION_PHONE: {
        type: String
    },
    ORGANIZATION_ACTIVE: {
        type: Boolean
    },
    IS_APPROVED: {
        TIME: {
            type: Date
        },
        CHECK: {
            type: Boolean
        },
        BLOCK_BY_USER_ID: {
            type: Schema.Types.ObjectId
        }
    },
    PACKAGE: {
        PACKAGE_ID: {
            type: Schema.Types.ObjectId,
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
        ACTIVE_FROM_DATE: {
            type: Date
        },
        ACTIVE_THRU_DATE: {
            type: Date
        }
    }   
});




module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);