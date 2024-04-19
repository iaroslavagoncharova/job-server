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

chatsRoute.post('/', authenticate, handlePostChat);

chatsRoute.post('/admin', authenticate, handlePostAdminChat);

chatsRoute.get('/messages/:messageId', authenticate, handleGetMessage);
chatsRoute.get('/user', authenticate, handleGetChatsByUser);
chatsRoute.get('/:chatId', authenticate, handleGetChatById);

chatsRoute.get('/:chatId/otherUser', authenticate, handleGetOtherChatUser);

chatsRoute.get(
  '/:chatId/messages',
  authenticate,
  handleGetMessagesByChatAndUser
);

chatsRoute.post('/:chatId/messages', authenticate, handlePostMessage);

chatsRoute.delete('/:chatId', authenticate, handleDeleteChat);

chatsRoute.put(
  '/interview/:chatId',
  authenticate,
  handleSendInterviewInvitation
);

chatsRoute.put('/interview_accept/:chatId', authenticate, handleAcceptInterviewInvitation);

chatsRoute.put('/interview_decline/:chatId', authenticate, handleDeclineInterviewInvitation);

export default chatsRoute;
