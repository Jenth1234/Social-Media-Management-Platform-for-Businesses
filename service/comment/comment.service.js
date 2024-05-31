const Comment = require("../../models/comment/comment.model");
class COMMENT_SERVICE {
  createComment = async (payload) => {
    const countCMT = 5
    const query = { PRODUCT_ID: payload.PRODUCT_ID, ORGANIZATION_ID: payload.ORGANIZATION_ID, LIST_COMMENT_MAX_NUMBER: { $lt: countCMT } };

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
        $inc: { LIST_COMMENT_MAX_NUMBER: 1 }
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

  getCommentWithUserInfo = async (page, limit) => {
    const skips = page ? (page - 1) * limit : 0;
    const cmtWithUserInfo = await Comment.aggregate ([
      {
        $unwind: "$LIST_COMMENT"
      },
      {
        $lookup: {
          from: "users",
          localField: "LIST_COMMENT.USER_ID",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "LIST_COMMENT.CONTENT": 1,
          "LIST_COMMENT.FROM_DATE": 1,
          "user.USERNAME": 1,
          "user.EMAIL": 1
        }
      },
      {
        $sort: { "LIST_COMMENT.FROM_DATE": -1}
      },
      {
        $skip: skips
      },
      {
        $limit: limit
      }
    ]);
    return cmtWithUserInfo;
  };


getCommentsByProduct = async (productId) => {
    try {
      const comments = await Comment.find({ PRODUCT_ID: productId });
      return comments;
    } catch (error) {
      throw new Error(`Error getting comments by product: ${error.message}`);
    }
  };

  deleteComment = async (commentIdOb, userIdOb) => {
    try {
      const result = await Comment.findOneAndUpdate(
        {
          LIST_COMMENT: {
            $elemMatch: {
              '_id': commentIdOb,
              'USER_ID': userIdOb
            }
          }

        },
        {
          $pull: {
            'LIST_COMMENT': {
              _id: commentIdOb,
              USER_ID: userIdOb
            }
          },
          $inc: {
            LIST_COMMENT_MAX_NUMBER: -1
          }
        },
        { new: true }
      );



      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
module.exports = new COMMENT_SERVICE();
