import express from 'express';
import { handleDeleteChat, handleGetChatById, handleGetChatsByUser, handleGetMessage, handleGetMessagesByChatAndUser, handleGetOtherChatUser, handlePostChat, handlePostMessage } from '../controllers/chatsController'; // Adjust the import path as necessary
import { authenticate } from '../../middlewares';

const chatsRoute = express.Router();

chatsRoute.post('/', authenticate, handlePostChat);

chatsRoute.get('/messages/:messageId', authenticate, handleGetMessage);
chatsRoute.get('/user', authenticate, handleGetChatsByUser);
chatsRoute.get('/:chatId', authenticate, handleGetChatById);

chatsRoute.get('/:chatId/otherUser', authenticate, handleGetOtherChatUser);

chatsRoute.get('/:chatId/messages', authenticate, handleGetMessagesByChatAndUser);

chatsRoute.post('/:chatId/messages', authenticate, handlePostMessage);


chatsRoute.delete('/:chatId', authenticate, handleDeleteChat);

export default chatsRoute;
