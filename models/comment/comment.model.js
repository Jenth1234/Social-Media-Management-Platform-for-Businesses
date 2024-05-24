var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId
    },
    LIST_COMMENT: [{
        USER_ID: {
            type: Schema.Types.ObjectId
        },
        CONTENT: {
            type: String
        },
        IS_ATTACHMENTS: [{}]
    }],
    PRODUCT_ID: {
        type: String
    },
    LIST_COMMENT_MAX_NUMBER: {
        type: Number
    }
});
module.exports = mongoose.model('Comment', CommentSchema);