const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataCmtProductSchema = new Schema ({
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId
    },
    PRODUCT_ID: {
        type: Schema.Types.ObjectId
    },
    COMMENT_COUNT: {
        type: Number
    }
});

module.exports = mongoose.model('metadata_comment_products', MetadataCmtProductSchema);