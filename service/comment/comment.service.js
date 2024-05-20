const Comment = require('../../models/comment/comment.model');

exports.createComment = async (commentData) => {
    try {
        const comment = new Comment(commentData);
        await comment.save();
        return comment;
    } catch (error) {
        throw new Error(`Error creating comment: ${error.message}`);
    }
};
exports.getCommentsByUser = async (userId) => {
    try {
        // Tìm tất cả các bình luận mà người dùng đã thực hiện
        const comments = await Comment.find({ "LIST_COMMENT.USER_ID": userId });
        
        return comments;
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về một promise bị reject với thông báo lỗi
        throw new Error(`Error getting comments by user: ${error.message}`);
    }
};
exports.getCommentsByProduct = async (productId) => {
    try {
        const comments = await Comment.find({ PRODUCT_ID: productId });
        return comments;
    } catch (error) {
        throw new Error(`Error getting comments by product: ${error.message}`);
    }
};
exports.deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId);
};