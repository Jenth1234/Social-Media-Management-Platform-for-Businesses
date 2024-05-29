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
    OBJECT_APPROVED: {
        TIME: {
            type: Date
        },
        CHECK: {
            type: Boolean,
            default: null
        },
        APPROVED_BY_USER_ID: {
            type: Schema.Types.ObjectId
        }
    },
});

module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);
