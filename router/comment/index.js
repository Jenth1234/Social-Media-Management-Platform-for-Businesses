const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment/comment.Controller');
const verifyToken = require('../../middleware/verifyToken');


router.post('/create',verifyToken, commentController.createComment);
// router.put('/:id', commentController.updateComment);
// router.get('/', commentController.getAllComments);
router.get('/:userId', commentController.getCommentsByUser);
router.get('/:productId/comments', commentController.getCommentsByProduct);

router.delete('/:commentId', commentController.deleteComment);
router.put('/update/:commentId',verifyToken,commentController.updateComment);

module.exports = router;
