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
        type: String
    }
});