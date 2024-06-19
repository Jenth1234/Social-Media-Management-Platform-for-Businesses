
const { containerClient } = require('../../config/configAzure');
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;
async function uploadImageToAzure(stream, fileName) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadStream(stream, undefined, undefined, {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg/' // Set proper content type here
    }
  });
  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
}

module.exports = {
  uploadImageToAzure

};
