const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

async function connectToBlobStorage() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient('your-container-name');
    const blobServiceClient_cmt = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient_cmt = blobServiceClient.getContainerClient('your-container-name');
    // Tạo container nếu nó không tồn tại
    await containerClient.createIfNotExists();
    console.log('Connected to Azure Blob Storage');

    // Ví dụ: tải lên một blob
    const blockBlobClient = containerClient.getBlockBlobClient('sample-blob.txt');
    const data = 'Hello, Azure Blob Storage!';
    await blockBlobClient.upload(data, data.length);
    console.log('Blob uploaded successfully');
}

connectToBlobStorage().catch(err => {
    console.error('Error connecting to Blob Storage:', err);
});

