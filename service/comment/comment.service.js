const Comment = require("../../models/comment/comment.model");
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

}
module.exports = new COMMENT_SERVICE();
