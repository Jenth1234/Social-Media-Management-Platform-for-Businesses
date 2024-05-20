const Comment = require('../../models/comment/comment.model');

// Tạo comment mới
exports.createComment = async (commentData) => {
    try {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    } catch (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
};

// Lấy tất cả các comment
exports.getAllComments = async () => {
    try {
        const comments = await Comment.find();
        return comments;
    } catch (error) {
        throw new Error(`Error fetching comments: ${error.message}`);
    }
};

// Lấy comment theo ID
exports.getCommentById = async (id) => {
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        throw new Error(`Error fetching comment: ${error.message}`);
    }
};

// Cập nhật comment theo ID
exports.updateComment = async (id, updateData) => {
    try {
        const comment = await Comment.findByIdAndUpdate(id, updateData, { new: true });
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        throw new Error(`Error updating comment: ${error.message}`);
    }
};

// Xóa comment theo ID
exports.deleteComment = async (id) => {
    try {
        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) {
            throw new Error('Comment not found');
        }
        return comment;
    } catch (error) {
        throw new Error(`Error deleting comment: ${error.message}`);
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
