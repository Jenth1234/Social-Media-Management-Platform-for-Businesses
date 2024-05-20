
const { createSchema } = require('../../models/comment/validate/index');
const Comment = require('../../models/comment/comment.model');
const commentService = require('../../service/comment/comment.service');
exports.createComment = async (req, res) => {
    try {
        const payload = req.body;
        const { error } = createSchema.validate(payload, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data',
                errors: error.details.map(detail => detail.message)
            });
        }
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

exports.getCommentsByUser = async (req, res) => {
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
exports.getCommentsByProduct = async (req, res) => {
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

exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//////
