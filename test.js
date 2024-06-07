const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { MongoClient } = require('mongodb');
const { Readable } = require('stream');
require('dotenv').config();

const dbConnect = require('./config/dbconnect');
const route = require('./router');
const app = express();
const port = process.env.PORT || 3000;
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);

const clientPromise = dbConnect();

async function extractMetadata(headers) {
  const contentType = headers['content-type'];
  const fileType = contentType.split('/')[1];
  const contentDisposition = headers['content-disposition'];
  const caption = headers['x-image-caption'] || 'Không có chú thích';
  const matches = /filename="([^"]+)/i.exec(contentDisposition);
  const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType };
}

async function uploadImageToAzure(stream, fileName) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadStream(stream, undefined, undefined, {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg' // Set proper content type here
    }
  });
  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
}

async function storeMetadata(fileName, caption, fileType, imageUrl) {
  try {
    console.log('Waiting for database connection...');

    console.log('Database connection established!');
    const collection = clientPromise.db("tutorial").collection('metadata');
    await collection.insertOne({ fileName, caption, fileType, imageUrl });
  } catch (error) {
    console.error('Error storing metadata:', error);
    throw error;
  }
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { fileName, caption, fileType } = await extractMetadata(req.headers);
    const stream = Readable.from(req.file.buffer);
    const imageUrl = await uploadImageToAzure(stream, fileName);
    await storeMetadata(fileName, caption, fileType, imageUrl);

    res.status(201).json({ message: "Ảnh đã được tải lên thành công" }); // Success response
  } catch (error) {
    console.error(error);
    let errorMessage = '';
    if (error.message.includes("invalid file type")) {
      errorMessage = "Chỉ chấp nhận file ảnh";
    } else if (error.message.includes("file size")) {
      errorMessage = "Kích thước file vượt quá giới hạn";
    } else {
      errorMessage = "Lỗi không xác định";
    }
    res.status(500).json({ error: errorMessage }); // Error response
  }
});

// Middleware
app.use(bodyParser.json());

route(app);

app.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng ${port} 2`);
});
