// config/azureConfig.js
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);
//cmt
const accountCMT = process.env.ACCOUNT_NAME_CMT;
const containerCMT = process.env.CONTAINER_NAME_CMT;

const blobServiceClient_cmt = new BlobServiceClient(`https://${accountCMT}.blob.core.windows.net/?${sasToken}`);
const containerClient_cmt = blobServiceClient.getContainerClient(containerCMT);
module.exports = {
  blobServiceClient,
  containerClient,
  blobServiceClient_cmt,
  containerClient_cmt
};
