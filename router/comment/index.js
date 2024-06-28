const express = require('express');
const router = express.Router();
const commentController = require("../../controllers/comment/comment.Controller")
// const verifyToken = require('../../middleware/verifyToken');
const {verifyToken, verifyTokenAdmin} = require('../../middleware/verifyToken');

router.post('/create',verifyToken,commentController.createComment);

router.get('/commentUserinfo', verifyTokenAdmin, commentController.getCommentWithUserInfo);
router.get('/user/:userId', verifyTokenAdmin, commentController.getCommentsByUser);
router.get('/product/:productId/comments', verifyToken, commentController.getCommentsByProduct);


router.put('/update/:commentId', verifyToken, commentController.updateComment);

router.post('/:commentId/reply', verifyToken, commentController.createReply);
module.exports = router;
