const { Readable } = require('stream');
const azureService = require('../../service/azure/azureService');

class AzureController {
  constructor() {
    this.azureService = new azureService();
  }

  async upload(req, res) {
    res.setHeader('Content-Type', 'application/json');

    try {
      const { fileName, caption, fileType } = await this.azureService.extractMetadata(req.headers);
      const stream = Readable.from(req.file);
      const imageUrl = await this.azureService.uploadImage(stream, fileName);
      await this.azureService.storeMetadata(fileName, caption, fileType, imageUrl);

      res.status(201).json({ message: "Ảnh đã được tải lên thành công" });
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
      res.status(500).json({ error: errorMessage });
    }
  }
}
async function createFolders() {
  try {
      // Lấy hoặc tạo container
      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists();

      // Tạo thư mục cha (nếu chưa tồn tại)
      const parentFolderClient = containerClient.getDirectoryClient(parentFolderName);
      await parentFolderClient.createIfNotExists();

      // Tạo thư mục con
      for (const subFolderName of subFolderNames) {
          const subFolderClient = parentFolderClient.getDirectoryClient(subFolderName);
          await subFolderClient.create();
          console.log(`Created subfolder '${subFolderName}' in '${parentFolderName}'.`);
      }

      console.log("Folders created successfully.");
  } catch (error) {
      console.error("Error occurred:", error.message);
  }
}


module.exports = new AzureController();
