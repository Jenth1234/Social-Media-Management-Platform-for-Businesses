const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    NAME_CATEGORY: {
        type: String,
        required: true
    },
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId,
        required: true
    },
    ROOT_CATEGORY_ID: {
        type: Schema.Types.ObjectId
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
