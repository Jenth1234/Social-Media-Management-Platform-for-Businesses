// config/azureConfig.js
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

module.exports = {
  blobServiceClient,
  containerClient
};
