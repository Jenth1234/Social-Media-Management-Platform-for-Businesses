const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment/comment.Controller');
const verifyToken = require('../../middleware/verifyToken');


router.post('/create',verifyToken, commentController.createComment);
// router.put('/:id', commentController.updateComment);
// router.get('/', commentController.getAllComments);
router.get('/:userId', commentController.getCommentsByUser);
router.get('/:productId/comments', commentController.getCommentsByProduct);
<<<<<<< HEAD
// router.delete('/:commentId', commentController.deleteComment);
// router.put('/update/:commentId',verifyToken,commentController.updateComment);
=======
router.delete('/:commentId', commentController.deleteComment);
router.put('/update/:commentId',verifyToken,commentController.updateComment);
>>>>>>> 4e8faf27985e7bf7614252e0d6bf59e7a5c8a91b
module.exports = router;
