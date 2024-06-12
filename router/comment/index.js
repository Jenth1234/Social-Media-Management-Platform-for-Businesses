const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment/comment.controller');
// const verifyToken = require('../../middleware/verifyToken');
const {verifyToken, verifyTokenAdmin} = require('../../middleware/verifyToken');

router.post('/create',verifyToken,commentController.createComment);
router.get('/commentUserinfo', verifyToken, commentController.getCommentWithUserInfo);
router.get('/user/:userId', commentController.getCommentsByUser);
router.get('/product/:productId/comments', commentController.getCommentsByProduct);
router.delete('/:commentId', commentController.deleteComment);
router.put('/update/:commentId', verifyToken, commentController.updateComment);

module.exports = router;
