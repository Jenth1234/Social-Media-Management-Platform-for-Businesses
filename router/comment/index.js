const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment/comment.Controller');

router.post('/create', commentController.createComment);
// router.put('/:id', commentController.updateComment);
// router.get('/', commentController.getAllComments);
router.get('/user/:userId', commentController.getCommentsByUser);
// router.get('/:id', commentController.getCommentById);
// router.delete('/:id', commentController.deleteComment);

module.exports = router;
