var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var REPLY = new Schema({
    COMMENT_ID: {
        type: Schema.Types.ObjectId
    },
    USER_ID: {
        type: USERS
    },
    COMMENT_REPLY: {
        type: Array
    }
});