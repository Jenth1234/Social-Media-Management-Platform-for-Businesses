const { createCommentValidate } = require('../../models/comment/validate/index');
const Comment = require('../../models/comment/comment.model');
const commentService = require('../../service/comment/comment.service');

class COMMENT_CONTROLLER {
    async createComment(req, res) {
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
            console.log('Payload after adding USER_ID:', payload);

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
    }

    async getCommentsByUser(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(404).json({
                    success: false,
                    message: 'UserID is required'
                });
            }

            const comments = await commentService.getCommentsByUser(userId);

            if (comments.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No comments found for this user'
                });
            }

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
    }

    async getCommentsByProduct(req, res) {
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
    }

    async getCommentWithUserInfo(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = req.query.page || 1;
            // const userId = req.user_id;
            const commentsWithUserInfo = await commentService.getCommentWithUserInfo(page, limit);
            res.json(commentsWithUserInfo);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    async updateComment(req, res) {
        try {
            const { commentId } = req.params;
            const { CONTENT } = req.body;

            const { error } = updateCommentValidate.validate({ CONTENT }, { abortEarly: false });
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data',
                    errors: error.details.map(detail => detail.message)
                });
            }

            const updatedComment = await commentService.updateCommentContent(commentId, CONTENT);

            if (!updatedComment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Comment has been updated successfully.',
                data: updatedComment
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    }

    async deleteComment(req, res) {
        const { commentId } = req.params;
        const userId = req.user_id;

        try {
            const response = await commentService.deleteComment(commentId, userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

 
    async createReply(req, res) {
        const { commentId } = req.params;
        const payload = req.body;
        const user_id = req.user_id;

        try {
            payload.USER_ID = user_id;
            const result = await commentService.createReply(commentId, payload);
            res.status(201).json({ message: 'Phản hồi đã được thêm thành công', result });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi thêm phản hồi', error: err.message });
        }
    }
    async getReplies(req, res) {
        try {
            const { commentId } = req.params;
            const replies = await commentService.getReplies(commentId);
    
            if (!replies || replies.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No replies found for this comment'
                });
            }
    
            return res.status(200).json({
                success: true,
                data: replies
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: err.message
            });
        }
    }
    async deleteComment(req, res) {
        const { commentId } = req.params;
        const userId = req.user_id;

        try {
            const response = await commentService.deleteComment(commentId, userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteReply(req, res) {
        const { commentId, replyId } = req.params;
        const userId = req.user_id;

        try {
            const response = await commentService.deleteReply(commentId, replyId, userId);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    
     
    

}

module.exports = new COMMENT_CONTROLLER();