const Comment = require("../../models/comment/comment.model");
const MetadataCmtProductService = require("../../service/metadata_cmt_product/metadatacmtproduct.service");
const { Types } = require("mongoose");
class COMMENT_SERVICE {
  createComment = async (payload) => {
    const countCMT = 200;
    const query = { 
      PRODUCT_ID: payload.PRODUCT_ID, 
      ORGANIZATION_ID: payload.ORGANIZATION_ID, 
      LIST_COMMENT_MAX_NUMBER: { $lt: countCMT } 
    };

      const comment_obj = {
        "USER_ID": payload.USER_ID,
        "CONTENT": payload.CONTENT,
        "ATTACHMENTS": payload.ATTACHMENTS,
        "FROM_DATE": Date.now(),
        "THRU_DATE": null
      };

    await MetadataCmtProductService.updateCmtCount(payload.PRODUCT_ID, payload.ORGANIZATION_ID, 1);

      await Comment.updateOne(
        query,
        {
          $push: {
            LIST_COMMENT: comment_obj
          }
        },
        { upsert: true }
      );
  
      return comment_obj;
  };
  
  
// Hàm lấy các comments của một người dùng mà chưa bị xóa mềm
async getCommentsByUser(userId) {
  try {
      const comments = await Comment.find({ USER_ID: userId }).lean();
      comments.forEach(comment => {
          comment.LIST_COMMENT = comment.LIST_COMMENT.filter(c => !c.IS_DELETED);
      });
      return comments;
  } catch (error) {
      throw error;
  }
}

  getCommentWithUserInfo = async (page, limit, userId) => {
    // const userIdOb = new Types.ObjectId(userId);

    const skips = page ? (page - 1) * limit : 0;
    const cmtWithUserInfo = await Comment.aggregate([
      //   { $match: {

      //     "LIST_COMMENT.USER_ID": userIdOb
      //   }
      // },
      {
        $unwind: "$LIST_COMMENT",
      },
      {
        $lookup: {
          from: "users",
          localField: "LIST_COMMENT.USER_ID",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "LIST_COMMENT.CONTENT": 1,
          "LIST_COMMENT.FROM_DATE": 1,
          "user.USERNAME": 1,
          "user.EMAIL": 1,
        },
      },
      {
        $sort: { "LIST_COMMENT.FROM_DATE": -1 },
      },
      {
        $skip: skips,
      },
      {
        $limit: limit,
      },
    ]);
    return cmtWithUserInfo;
  };

// Hàm lấy các comments của một sản phẩm mà chưa bị xóa mềm
async getCommentsByProduct(productId) {
  try {
      const comments = await Comment.find({ PRODUCT_ID: productId }).lean();
      comments.forEach(comment => {
          comment.LIST_COMMENT = comment.LIST_COMMENT.filter(c => !c.IS_DELETED);
      });
      return comments;
  } catch (error) {
      throw error;
  }
}

  updateCommentContent = async (commentId, content) => {
    try {
      const result = await Comment.findOneAndUpdate(
        { "LIST_COMMENT._id": Types.ObjectId(commentId) },
        {
          $set: { "LIST_COMMENT.$.CONTENT": content },
        },
        { new: true }
      );

      if (result) {
        const updatedComment = result.LIST_COMMENT.find(
          (comment) => comment._id.toString() === commentId
        );
        return updatedComment;
      }

      return null;
    } catch (error) {
      throw new Error(`Error updating comment content: ${error.message}`);
    }
  };

  async deleteComment(commentId, userId) {
    try {
        const comment = await Comment.findOneAndUpdate(
            { 'LIST_COMMENT._id': commentId, 'LIST_COMMENT.USER_ID': userId },
            { $set: { 'LIST_COMMENT.$.IS_DELETED': true } },
            { new: true }
        );
        if (!comment) {
            throw new Error('Comment not found or user not authorized');
        }
        return {
            success: true,
            message: 'Comment has been deleted successfully.',
            data: comment
        };
    } catch (error) {
        throw error;
    }
}

  createReply = async (commentId, payload) => {
    try {
      const replies_obj = {
        USER_ID: payload.USER_ID,
        CONTENT: payload.CONTENT,
        ATTACHMENTS: payload.ATTACHMENTS,
        FROM_DATE: Date.now(),
        THRU_DATE: null,
      };

      const result = await Comment.updateOne(
        { "LIST_COMMENT._id": new Types.ObjectId(commentId) },
        { $push: { "LIST_COMMENT.$.REPLIES": replies_obj } }
      );

      return result;
    } catch (error) {
      throw new Error(`Error creating reply: ${error.message}`);
    }
  };
  async getReplies(commentId) {
    try {
        const comment = await Comment.findOne({ 'LIST_COMMENT._id': commentId, 'LIST_COMMENT.IS_DELETED': false });
        if (!comment) {
            throw new Error('Comment not found');
        }
        const replies = comment.LIST_COMMENT[0].REPLIES.filter(reply => !reply.IS_DELETED);
        return replies;
    } catch (error) {
        throw error;
    }
}
// Hàm xóa mềm reply
async deleteReply(commentId, replyId, userId) {
  try {
      const comment = await Comment.findOneAndUpdate(
          { 'LIST_COMMENT._id': commentId, 'LIST_COMMENT.REPLIES._id': replyId, 'LIST_COMMENT.REPLIES.USER_ID': userId },
          { $set: { 'LIST_COMMENT.$.REPLIES.$[elem].IS_DELETED': true } },
          {
              arrayFilters: [{ 'elem._id': replyId }],
              new: true
          }
      );
      if (!comment) {
          throw new Error('Reply not found or user not authorized');
      }
      return {
          success: true,
          message: 'Reply has been deleted successfully.',
          data: comment
      };
  } catch (error) {
      throw error;
  }
}

}
module.exports = new COMMENT_SERVICE();