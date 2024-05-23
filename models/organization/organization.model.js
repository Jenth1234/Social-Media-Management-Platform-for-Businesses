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
        type: Boolean,
        default: false
    },
    IS_APPROVED: {
        TIME: {
            type: Date
        },
        CHECK: {
            type: Boolean,
            default: null
        },
        BLOCK_BY_USER_ID: {
            type: Schema.Types.ObjectId
        }
    },
    USERS: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);
