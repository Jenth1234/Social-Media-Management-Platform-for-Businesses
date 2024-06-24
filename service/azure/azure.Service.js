
const { Readable } = require('stream');
const azureBlobModel = require('../../models/azureBlob/azureBlob.model');
const dbConnect = require('../../config/dbconnect');
const metadata_avatar = require('../../models/azureBlob/modelAzure');
const metadata_cmt = require('../../models/azureBlob/modelAzure_cmt');

const User = require('../../models/user/user.model');
const { MIMEType } = require('util');
async function extractMetadata(headers) {
  const contentType = headers['content-type'];
   const fileType = contentType.split('/')[1]; 
 
  const contentDisposition = headers['content-disposition'];
  const caption = headers['x-image-caption'] || 'Không có chú thích';
  const matches = /filename="([^"]+)/i.exec(contentDisposition);
  const fileName = matches?.[1] || `image-${Date.now()}.${fileType}`;
  return { fileName, caption, fileType };
}


async function storeMetadata(fileName, caption, fileType, imageUrl, userId) {
  try {
    const metadata = new metadata_avatar({
      fileName: fileName,
      caption: caption,
      fileType: fileType,
      imageUrl: imageUrl
    });

    await metadata.save();
    console.log(`Đã lưu thông tin metadata_img của ảnh ${fileName} vào MongoDB`);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User không tồn tại');
    }

    user.AVATAR = metadata.imageUrl;
    await user.save();
    console.log(`Đã cập nhật avatar của user ${userId}`);

    return metadata;
  } catch (error) {
    console.error('Lỗi khi lưu thông tin metadata vào MongoDB:', error);
    throw error;
  }
}
async function handleUpload(req, userId) {
  const { fileName, caption, fileType } = await extractMetadata(req.headers);

  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const stream = Readable.from(req.file.buffer);
  const imageUrl = await azureBlobModel.uploadImageToAzure(stream, fileName);
  await storeMetadata(fileName, caption, fileType, imageUrl,userId);

  return { fileName, caption, fileType, imageUrl };
}
async function extractMetadata_cmt(headers) {
  const contentType = headers['content-type'];
  const fileType = contentType.split('/')[1]; 
  const contentDisposition = headers['content-disposition'];

  const matches = /filename="([^"]+)"/i.exec(contentDisposition);
  const fileName = matches?.[1] || `file-${Date.now()}.${fileType}`;

  return { fileName, fileType };
}



async function storeMetadata_cmt(fileName, caption, fileType, imageUrl) {
  try {
    const metadata = new metadata_cmt({
      fileName: fileName,
      caption: caption,
      fileType: fileType,
      imageUrl: imageUrl
    });

    await metadata.save();
    console.log(`Đã lưu thông tin metadata_cmt của ảnh ${fileName} vào MongoDB`);

   
    return metadata;
  } catch (error) {
    console.error('Lỗi khi lưu thông tin metadata vào MongoDB:', error);
    throw error;
  }
}
async function handleUpload_cmt(req) {
  try {
    const { fileName, caption, fileType } = await extractMetadata_cmt(req.headers);

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const stream = Readable.from(req.file.buffer);
    const imageUrl = await azureBlobModel.uploadImageAndVideoToAzure(stream, fileName);
    await storeMetadata_cmt(fileName, caption, fileType, imageUrl);

    return { fileName, caption, fileType, imageUrl };
  } catch (error) {
    console.error('Error in handleUpload_cmt:', error);
    throw error;
  }
}



module.exports = {
  extractMetadata,
  storeMetadata,
  handleUpload,
  extractMetadata_cmt,
  storeMetadata_cmt,
  handleUpload_cmt
};
