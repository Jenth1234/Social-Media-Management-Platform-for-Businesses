const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const azure_controller = require('../../controllers/azure/azure.controller');
const {verifyToken} = require('../../middleware/verifyToken')

router.post('/upload', verifyToken, upload.single('AVATAR'), (req, res) => {
    azure_controller.upload(req, res);
});



router.post('/create', (req, res) => {
    res.send('Route POST: Tạo mới đối tượng');
});







// router.get('/organization', AuthMiddleware.checkOrganization,user_controller.login);

module.exports = router;
