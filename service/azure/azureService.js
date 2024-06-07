const AzureBlobModel = require('../../models/azureBlob/azureBlob.model');
const dbConnect = require('../../config/dbconnect');

class AzureService {
  constructor() {
    this.AzureBlobModel = new AzureBlobModel();
    this.clientPromise = dbConnect();
  }

  async extractMetadata(headers) {
    const contentType = headers['content-type'] || '';
    const fileType = contentType.split('/')[1] || '';
    const contentDisposition = headers['content-disposition'] || '';
    const caption = headers['x-image-caption'] || 'Không có chú thích';

    let fileName = `image-${Date.now()}.${fileType}`;
    const matches = /filename="([^"]+)/i.exec(contentDisposition);
    if (matches && matches[1]) {
        fileName = matches[1];
    }

    return { fileName, caption, fileType };
}

  async uploadImage(stream, fileName) {
    try {
      // Gọi phương thức uploadImageToAzure từ AzureBlobModel
      const imageUrl = await this.AzureBlobModel.uploadImageToAzure(stream, fileName);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to Azure:', error);
      throw error;
    }
  }

  async storeMetadata(fileName, caption, fileType, imageUrl) {
    try {
      const client = await this.clientPromise;
      const collection = client.db("tutorial").collection('metadata');
      await collection.insertOne({ fileName, caption, fileType, imageUrl });
    } catch (error) {
      console.error('Error storing metadata:', error);
      throw error;
    }
  }
}

module.exports = AzureService;
