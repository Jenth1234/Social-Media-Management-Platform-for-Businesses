
const { handleUpload } = require('../../service/azure/azure.Service');

async function upload(req, res) {
  res.setHeader('Content-Type', 'application/json');

  try {
      const userId = req.user.id;
    const { fileName, caption, fileType, imageUrl} = await handleUpload(req,userId);
  
    res.status(201).json({ message: "Ảnh đã được tải lên thành công", imageUrl });
  } catch (error) {
    console.error(error);
    let errorMessage = '';
    if (error.message.includes("invalid file type")) {
      errorMessage = "Chỉ chấp nhận file ảnh";
    } else if (error.message.includes("file size")) {
      errorMessage = "Kích thước file vượt quá giới hạn";
    } else if (error.message === 'No file uploaded') {
      errorMessage = "Không có file nào được tải lên";
    } else {
      errorMessage = "Lỗi không xác định";
    }
    res.status(500).json({ error: errorMessage });
  }
}

module.exports = {
  upload
};
