const mongoose = require('mongoose');
const attachmentSchema = new mongoose.Schema({
    fileName: String,
    caption: String,
    fileType: String,
    imageUrl: String
});
const AzureBlobModel_cmt = mongoose.model('metadata_attachment',attachmentSchema);
module.exports = AzureBlobModel_cmt;