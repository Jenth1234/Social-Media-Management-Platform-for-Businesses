const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    NAME_CATEGORY: {
        type: String,
        required: true
    },
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Organization'
    },
    ROOT_CATEGORY_ID: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    COMMENT_TYPE: {
        type: String,
        required: true,
        enum: ['product', 'post', 'video']
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
