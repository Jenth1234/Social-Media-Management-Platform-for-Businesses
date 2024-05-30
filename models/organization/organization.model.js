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
    IS_APPROVED: {
        TIME: {
            type: Date
          },
        CHECK: {
            type: Boolean
          },
        APPROVED_BY_USER_ID: {
            type: Schema.Types.ObjectId
          }
    }
});
module.exports = mongoose.model("ORGANIZATION", ORGANIZATION);