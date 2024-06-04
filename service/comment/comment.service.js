const Comment = require('../../models/comment/comment.model');
class COMMENT_SERVICE {
    createComment = async (payload) => {
        const countCMT = 5
         const query = { PRODUCT_ID: payload.PRODUCT_ID,  ORGANIZATION_ID: payload.ORGANIZATION_ID, LIST_COMMENT_MAX_NUMBER: { $lt: countCMT }}; 

        const comment_obj = { 
            "USER_ID": payload.USER_ID, 
            "CONTENT": payload.CONTENT, 
            "ATTACHMENTS": payload.ATTACHMENTS, 
            "FROM_DATE": Date.now(), 
            "THRU_DATE": null 
        }
       
            await Comment.updateOne(
                    query,
                {
                    $push: { 
                        LIST_COMMENT: comment_obj
                    },
                      $inc: {LIST_COMMENT_MAX_NUMBER: 1 }
                },
                { upsert: true } 
            );
           
       return comment_obj
    };
  getCommentsByUser = async (userId) => {
    try {
        // Tìm tất cả các bình luận mà người dùng đã thực hiện
        const comments = await Comment.find({ "LIST_COMMENT.USER_ID": userId });
        
        return comments;
    } catch (error) {
        // Nếu có lỗi xảy ra, trả về một promise bị reject với thông báo lỗi
        throw new Error(`Error getting comments by user: ${error.message}`);
    }
};
getCommentsByProduct = async (productId) => {
    try {
        const comments = await Comment.find({ PRODUCT_ID: productId });
        return comments;
    } catch (error) {
        throw new Error(`Error getting comments by product: ${error.message}`);
    }
};
deleteComment = async (commentId) => {
    return await Comment.findByIdAndDelete(commentId);
  };

<<<<<<< HEAD
}
module.exports = new COMMENT_SERVICE();
=======
  updateCommentContent = async (commentId, content) => {
    try {
      const result = await Comment.findOneAndUpdate(
        { "LIST_COMMENT._id": commentId },
        {
          $set: { "LIST_COMMENT.$.CONTENT": content }
        },
        { new: true }
      );
      
      if (result) {
        // Tìm bình luận đã được cập nhật
        const updatedComment = result.LIST_COMMENT.find(comment => comment._id.toString() === commentId);
        return updatedComment;
      }
      
      return null;
    } catch (error) {
      throw new Error(`Error updating comment content: ${error.message}`);
    }
  };
  deleteComment = async (commentId, userId) => {
    try {
      const commentDoc = await Comment.findOne({ 'LIST_COMMENT._id': commentId });  
      if (!commentDoc) {
        throw new Error('Comment not found');
      }
      
      const comment = commentDoc.LIST_COMMENT.id(commentId);
      if (!comment) {
        throw new Error('Comment not found');
      }
  
     
      comment.remove();
      await commentDoc.save();
  
      return { message: 'Comment deleted successfully', updatedDocument: commentDoc };
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = new COMMENT_SERVICE();
>>>>>>> 4e8faf27985e7bf7614252e0d6bf59e7a5c8a91b
