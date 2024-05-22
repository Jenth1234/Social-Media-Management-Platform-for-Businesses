
const { createCommentValidate } = require('../../models/comment/validate/index');
const Comment = require('../../models/comment/comment.model');
const commentService = require('../../service/comment/comment.service');
class COMMENT_CONTROLLER{
createComment = async (req, res) => {
    try {
        const payload = req.body;
        const user_id = req.user_id;
        const _ID = req.header('_ID');
        console.log(_ID)
        payload.ORGANIZATION_ID = _ID
        const { error } = createCommentValidate.validate(payload, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data',
                errors: error.details
            });
        }
        payload.USER_ID = user_id

        const newComment = await commentService.createComment(payload);

        return res.status(201).json({
            success: true,
            message: 'Comment has been created successfully.',
            data: newComment
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

getCommentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const comments = await commentService.getCommentsByUser(userId);
        
        return res.status(200).json({
            success: true,
            data: comments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};
getCommentsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await commentService.getCommentsByProduct(productId);
        
        return res.status(200).json({
            success: true,
            data: comments
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user_id;
  
    try {
      const response = await deleteComment(commentId, userId);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  


}

module.exports = new COMMENT_CONTROLLER();

