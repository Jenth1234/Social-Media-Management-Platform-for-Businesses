const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment/comment.controller');
const verifyToken = require('../../middleware/verifyToken');

router.post('/create', verifyToken, commentController.createComment);
// router.put('/:id', commentController.updateComment);
// router.get('/', commentController.getAllComments);
router.get('/commentWuserinfo', verifyToken, commentController.getCommentWithUserInfo);
router.get('/:userId', commentController.getCommentsByUser);
router.get('/:productId/comments', commentController.getCommentsByProduct);
router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
