const express = require('express');
const router = express.Router();
const commentController = require("../../controllers/comment/comment.Controller")
// const verifyToken = require('../../middleware/verifyToken');
const {verifyToken, verifyTokenAdmin} = require('../../middleware/verifyToken');

router.post('/create',verifyToken,commentController.createComment);

router.get('/commentUserinfo', verifyTokenAdmin, commentController.getCommentWithUserInfo);
// router.get('/:userId', verifyTokenAdmin, commentController.getCommentsByUser);
router.get('/:productId/product', verifyToken, commentController.getCommentsByProduct);
router.delete('/:commentId',verifyToken, commentController.deleteComment);

router.put('/update/:commentId', verifyToken, commentController.updateComment);

router.post('/:commentId/reply', verifyToken, commentController.createReply);
router.get('/:commentId/reply',verifyToken,commentController.getReplies);
module.exports = router;
