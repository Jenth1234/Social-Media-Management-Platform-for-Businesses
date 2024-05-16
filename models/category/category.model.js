var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CATEGORY = new Schema({
    NAME_CATEGORY: {
        type: String
    },
    ORGANIZATION_ID: {
        type: Schema.Types.ObjectId
    },
    ROOT_CATEGORY_ID: {
        type: Schema.Types.ObjectId
    }
});