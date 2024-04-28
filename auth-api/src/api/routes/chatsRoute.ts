import express from 'express';
import {
  handleAcceptInterviewInvitation,
  handleDeclineInterviewInvitation,
  handleDeleteChat,
  handleGetChatById,
  handleGetChatsByUser,
  handleGetMessage,
  handleGetMessagesByChatAndUser,
  handleGetOtherChatUser,
  handlePostAdminChat,
  handlePostChat,
  handlePostMessage,
  handleSendInterviewInvitation,
} from '../controllers/chatsController'; // Adjust the import path as necessary
import {authenticate} from '../../middlewares';

const chatsRoute = express.Router();

chatsRoute
  /**
   * @api {post} / Post a chat
   * @apiName postChat
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiDescription Post a chat
   * @apiParam {Number} match_id Match ID
   * @apiSuccess {Object} chat Chat object
   * @apiSuccess {Number} chat.chat_id Chat ID
   * @apiSuccess {Number} chat.user1_id User 1 ID
   * @apiSuccess {Number} chat.user2_id User 2 ID
   * @apiSuccess {String} chat.interview_status Interview status
   * @apiSuccess {Date} chat.created_at Chat created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "chat": {
   *           "chat_id": 1,
   *           "user1_id": 1,
   *           "user2_id": 2,
   *           "interview_status": NULL,
   *           "created_at": "2021-01-01T00:00:00.000Z"
   *          }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Chat not created"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal server error
   * {
   *  "message": "Internal server error"
   * }
   */
  .post('/', authenticate, handlePostChat);

chatsRoute
  /**
   * @api {post} /admin Post a chat with admin
   * @apiName postAdminChat
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiDescription Post a chat with admin
   * @apiParam {Number} user1_id User 1 ID
   * @apiSuccess {Object} chat Chat object
   * @apiSuccess {Number} chat.chat_id Chat ID
   * @apiSuccess {Number} chat.user1_id User 1 ID
   * @apiSuccess {Number} chat.user2_id User 2 ID
   * @apiSuccess {String} chat.interview_status Interview status
   * @apiSuccess {Date} chat.created_at Chat created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "chat": {
   *           "chat_id": 1,
   *           "user1_id": 1,
   *           "user2_id": 2,
   *           "interview_status": NULL,
   *           "created_at": "2021-01-01T00:00:00.000Z"
   *          }
   * }
   *
   */
  .post('/admin', authenticate, handlePostAdminChat);

chatsRoute
  /**
   * @api {get} /messages/:messageId Get message by ID
   * @apiName Get message by ID
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiParam {Number} messageId Message ID
   * @apiSuccess {Object} message Message object
   * @apiSuccess {Number} message.message_id Message ID
   * @apiSuccess {Number} message.user_id User ID
   * @apiSuccess {Number} message.chat_id Chat ID
   * @apiSuccess {String} message.message_text Message text
   * @apiSuccess {Date} message.sent_at Message sent at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": {
   *              "message_id": 1,
   *              "user_id": 1,
   *              "chat_id": 1,
   *              "message_text": "Hello",
   *              "sent_at": "2021-01-01T00:00:00.000Z"
   *             }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Message not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .get('/messages/:messageId', authenticate, handleGetMessage);
chatsRoute
  /**
   * @api {get} /chats/user Get chats by user
   * @apiName Get chats by user
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiSuccess {Object[]} chats Chats object
   * @apiSuccess {Number} chats.chat_id Chat ID
   * @apiSuccess {Number} chats.user1_id User 1 ID
   * @apiSuccess {Number} chats.user2_id User 2 ID
   * @apiSuccess {String} chats.interview_status Interview status
   * @apiSuccess {Date} chats.created_at Chat created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "chats": [
   *            {
   *             "chat_id": 1,
   *             "user1_id": 1,
   *             "user2_id": 2,
   *             "interview_status": "Pending",
   *             "created_at": "2021-01-01T00:00:00.000Z"
   *            },
   *            {
   *             "chat_id": 2,
   *             "user1_id": 1,
   *             "user2_id": 3,
   *             "interview_status": "Accepted",
   *             "created_at": "2021-01-01T00:00:00.000Z"
   *             }
   *          ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Chats not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal server error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/user', authenticate, handleGetChatsByUser);
chatsRoute
  /**
   * @api {get} /chats/:chatId Get chat by ID
   * @apiName Get chat by ID
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiParam {Number} chatId Chat ID
   * @apiSuccess {Object} chat Chat object
   * @apiSuccess {Number} chat.chat_id Chat ID
   * @apiSuccess {Number} chat.user1_id User 1 ID
   * @apiSuccess {Number} chat.user2_id User 2 ID
   * @apiSuccess {String} chat.interview_status Interview status
   * @apiSuccess {Date} chat.created_at Chat created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "chat": {
   *           "chat_id": 1,
   *           "user1_id": 1,
   *           "user2_id": 2,
   *           "interview_status": "pending",
   *           "created_at": "2021-01-01T00:00:00.000Z"
   *          }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Chat not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/:chatId', authenticate, handleGetChatById);

chatsRoute
  /**
   * @api {get} /chats/:chatId/otherUser Get other user by chat
   * @apiName Get other user by chat
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiParam {Number} chatId Chat ID
   * @apiSuccess {Object} user User object
   * @apiSuccess {Number} user.user_id User ID
   * @apiSuccess {String} user.username Username
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "user": {
   *           "user_id": 2,
   *           "username": "janedoe"
   *          }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Message not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/:chatId/otherUser', authenticate, handleGetOtherChatUser);

chatsRoute
  /**
   * @api {get} /chats/:chatId/messages Get messages by chat and user
   * @apiName Get messages by chat and user
   * @apiGroup Chats
   * @apiVersion  1.0.0
   * @apiPermission authenticated user
   * @apiParam {Number} chatId Chat ID
   * @apiSuccess {Object[]} messages Messages object
   * @apiSuccess {Number} messages.message_id Message ID
   * @apiSuccess {Number} messages.user_id User ID
   * @apiSuccess {Number} messages.chat_id Chat ID
   * @apiSuccess {String} messages.message_text Message text
   * @apiSuccess {Date} messages.sent_at Message sent at
   * @apiSuccess {String} messages.username Username
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "messages": [
   *               {
   *                "message_id": 1,
   *                "user_id": 1,
   *                "chat_id": 1,
   *                "message_text": "Hello",
   *                "sent_at": "2021-01-01T00:00:00.000Z",
   *                "username": "johndoe"
   *               },
   *               {
   *                "message_id": 2,
   *                "user_id": 2,
   *                "chat_id": 1,
   *                "message_text": "Hi",
   *                "sent_at": "2021-01-01T00:00:00.000Z",
   *                "username": "janedoe"
   *               }
   *             ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Messages not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500
   * {
   *  "message": "Failed to get messages"
   * }
   *
   */
  .get('/:chatId/messages', authenticate, handleGetMessagesByChatAndUser);

chatsRoute
/**
 * @api {post} /:chatId/messages Post a message
 * @apiName Post a message
 * @apiGroup Chats
 * @apiVersion  1.0.0
 * @apiPermission authenticated user
 * @apiDescription Post a message
 * @apiParam {Number} chatId Chat ID
 * @apiParam {String} message_text Message text
 * @apiSuccess {Object} message Message object
 * @apiSuccess {String} message Message
 * @apiSuccess {Object} media Message object
 * @apiSuccess {Number} message.message_id Message ID
 * @apiSuccess {Number} message.user_id User ID
 * @apiSuccess {Number} message.chat_id Chat ID
 * @apiSuccess {String} message.message_text Message text
 * @apiSuccess {Date} message.sent_at Message sent at
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "message": "Message sent",
 *  "media": {
 *            "message_id": 1,
 *            "user_id": 1,
 *            "chat_id": 1,
 *            "message_text": "Hello",
 *            "sent_at": "2021-01-01T00:00:00.000Z"
 *           }
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Message not created"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.post('/:chatId/messages', authenticate, handlePostMessage);

chatsRoute
/**
 * @api {delete} /:chatId Delete chat
 * @apiName Delete chat
 * @apiGroup Chats
 * @apiVersion  1.0.0
 * @apiPermission authenticated user
 * @apiDescription Delete chat
 * @apiParam {Number} chatId Chat ID
 * @apiSuccess {Object} message Message object
 * @apiSuccess {String} message Message
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "message": "Chat deleted"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Failed to delete chat"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Internal server error"
 * }
 */
.delete('/:chatId', authenticate, handleDeleteChat);

chatsRoute
/**
 * @api {put} /interview/:chatId Send interview invitation
 * @apiName Send interview invitation
 * @apiGroup Chats
 * @apiVersion  1.0.0
 * @apiPermission authenticated user
 * @apiDescription Send interview invitation
 * @apiParam {Number} chatId Chat ID
 * @apiSuccess {Object} message Message object
 * @apiSuccess {String} message Message
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "message": "Interview invitation sent"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Failed to send interview invitation"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Internal server error"
 * }
 */
.put(
  '/interview/:chatId',
  authenticate,
  handleSendInterviewInvitation
);

chatsRoute
/**
 * @api {put} /interview_accept/:chatId Accept interview invitation
 * @apiName Accept interview invitation
 * @apiGroup Chats
 * @apiVersion  1.0.0
 * @apiPermission authenticated user
 * @apiDescription Accept interview invitation
 * @apiParam {Number} chatId Chat ID
 * @apiSuccess {Object} message Message object
 * @apiSuccess {String} message Message
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "message": "Interview invitation accepted"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Failed to accept interview invitation"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Internal server error"
 * }
 */
.put(
  '/interview_accept/:chatId',
  authenticate,
  handleAcceptInterviewInvitation
);

chatsRoute
/**
 * @api {put} /interview_decline/:chatId Decline interview invitation
 * @apiName Decline interview invitation
 * @apiGroup Chats
 * @apiVersion  1.0.0
 * @apiPermission authenticated user
 * @apiDescription Decline interview invitation
 * @apiParam {Number} chatId Chat ID
 * @apiSuccess {Object} message Message object
 * @apiSuccess {String} message Message
 * @apiSuccessExample {json} Success-Response:
 * {
 *  "message": "Interview invitation declined"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Failed to decline interview invitation"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal server error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.put(
  '/interview_decline/:chatId',
  authenticate,
  handleDeclineInterviewInvitation
);

export default chatsRoute;
