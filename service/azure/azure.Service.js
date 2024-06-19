
const { Readable } = require('stream');
const azureBlobModel = require('../../models/azureBlob/azureBlob.model');
const dbConnect = require('../../config/dbconnect');
const imgAuzre = require('../../models/azureBlob/modelAzure')

async function extractMetadata(headers) {
  const contentType = headers['content-type'];
  const fileType = contentType.split('/')[1];
  const contentDisposition = headers['content-disposition'];
  const caption = headers['x-image-caption'] || 'Không có chú thích';
  const matches = /filename="([^"]+)/i.exec(contentDisposition);
  const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType };
}

async function storeMetadata(fileName, caption, fileType, imageUrl) {
  try {
    const metadata = new imgAuzre({
      fileName: fileName,
      caption: caption,
      fileType: fileType,
      imageUrl: imageUrl
    });

    await metadata.save();
    console.log(`Đã lưu thông tin metadata_img của ảnh ${fileName} vào MongoDB`);

    return metadata;
  } catch (error) {
    console.error('Lỗi khi lưu thông tin metadata vào MongoDB:', error);
    throw error;
  }
}
async function handleUpload(req) {
  const { fileName, caption, fileType } = await extractMetadata(req.headers);

  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const stream = Readable.from(req.file.buffer);
  const imageUrl = await azureBlobModel.uploadImageToAzure(stream, fileName);
  await storeMetadata(fileName, caption, fileType, imageUrl);

  return { fileName, caption, fileType, imageUrl };
}

module.exports = {
  extractMetadata,
  storeMetadata,
  handleUpload
};
