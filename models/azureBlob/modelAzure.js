const mongoose = require('mongoose');

const imgAzureSchema = new mongoose.Schema({
    fileName: String,
    caption: String,
    fileType: String,
    imageUrl: String
});

const AzureBlobModel = mongoose.model('metadata_avatar', imgAzureSchema);

module.exports = AzureBlobModel;
