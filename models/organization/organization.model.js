const { date } = require('joi');
const { ObjectId } = require('mongodb');

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

    REGISTER_DATE: {
        type: Date
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
    },

    LIST_CATEGORY: [{
        CATEGORY_ID: {
            type: Schema.Types.ObjectId
        },
        LIST_PRODUCT: [{}]
    }]
});
module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);
