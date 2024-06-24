const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { MongoClient } = require('mongodb');
const { Readable } = require('stream');
const crypto = require('crypto');
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
  const fileName = matches?.[1] || `file-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType, contentType };
}

async function uploadFileToAzure(stream, fileName, contentType, contentMd5) {
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  await blockBlobClient.uploadStream(stream, undefined, undefined, {
    blobHTTPHeaders: {
      blobContentType: contentType, // Set proper content type here
      blobContentMD5: contentMd5 // Set MD5 hash here
    }
  });
  return `https://${accountName}.blob.core.windows.net/${containerName}/${fileName}`;
}

async function storeMetadata(fileName, caption, fileType, fileUrl) {
  try {
    console.log('Waiting for database connection...');
    const db = await clientPromise;
    console.log('Database connection established!');
    const collection = db.db("tutorial").collection('metadata');
    await collection.insertOne({ fileName, caption, fileType, fileUrl });
  } catch (error) {
    console.error('Error storing metadata:', error);
    throw error;
  }
}

// Filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg', 'video/ogg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.post('/api/upload', upload.single('file'), async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  try {
    const { fileName, caption, fileType, contentType } = await extractMetadata(req.headers);

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Calculate MD5 hash
    const md5sum = crypto.createHash('md5');
    md5sum.update(req.file.buffer);
    const contentMd5 = md5sum.digest();

    const stream = Readable.from(req.file.buffer);
    const fileUrl = await uploadFileToAzure(stream, fileName, contentType, contentMd5);
    await storeMetadata(fileName, caption, fileType, fileUrl);

    res.status(201).json({ message: "File đã được tải lên thành công", url: fileUrl }); // Success response
  } catch (error) {
    console.error(error);
    let errorMessage = '';
    if (error.message.includes('Invalid file type')) {
      errorMessage = "Chỉ chấp nhận file ảnh hoặc video";
    } else if (error.message.includes('file size')) {
      errorMessage = "Kích thước file vượt quá giới hạn";
    } else if (error.message === 'No file uploaded') {
      errorMessage = "Không có file nào được tải lên";
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
  console.log(`Máy chủ đang chạy trên cổng ${port} `);
});
