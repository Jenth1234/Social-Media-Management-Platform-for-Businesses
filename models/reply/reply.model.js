// reply.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema cho replies
const ReplySchema = new Schema({
    COMMENT_ID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    LIST_REPLY_COMMENT_REF: [{
        USER_ID: {
            type: Schema.Types.ObjectId,
            required: true
        },
        CONTENT: {
            type: String,
            required: true
        },
        ATTACHMENTS: [{
            url: String,
            description: String
        }],
        FROM_DATE: {
            type: Date,
            default: Date.now
        },
        THRU_DATE: {
            type: Date,
            default: null
        },
  
    }],
    LIST_COMMENT_REPLY_MAX_NUMBER: {
        type: Number,
        required: true,
        default: 200
    }
});


module.exports = mongoose.model('Reply', ReplySchema);
