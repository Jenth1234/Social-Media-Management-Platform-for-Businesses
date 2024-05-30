const express = require('express');
const router = express.Router();
const metadatacmtproductController = require('../../controllers/metadatacmtproduct/metadatacmtproduct.controller');
const verifyToken = require('../../middleware/verifyToken');

router.post('/updateCommentCount', metadatacmtproductController.updateCommentCountController);

module.exports = router;