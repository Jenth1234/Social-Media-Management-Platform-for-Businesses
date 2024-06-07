const express = require("express");
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const azure_controller = require('../../controllers/azure/azure.controller');
router.post('/upload', upload.single('file'), (req, res) => azure_controller.upload(req, res));

router.get('/', (req, res) => {
    res.send('Chào mừng đến với router!');
});


router.post('/create', (req, res) => {
    res.send('Route POST: Tạo mới đối tượng');
});







// router.get('/organization', AuthMiddleware.checkOrganization,user_controller.login);

module.exports = router;
