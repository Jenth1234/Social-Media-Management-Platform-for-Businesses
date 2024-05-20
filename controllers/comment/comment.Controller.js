const { createSchema } = require('../../models/comment/validate/index');
const Comment = require('../../models/comment/comment.model');

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
        const newComment = new Comment(payload);
        await newComment.save();

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
exports.getCommentsByUser = async (userId) => {
    try {
        const comments = await Comment.find({ userId: userId });
        return comments;
    } catch (err) {
        throw new Error('Không thể lấy các bình luận của người dùng: ' + err.message);
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
            message: 'Lỗi máy chủ nội bộ',
            error: err.message
        });
    }
};
