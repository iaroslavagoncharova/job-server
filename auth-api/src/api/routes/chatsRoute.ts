import express from 'express';
import { handleDeleteChat, handleGetChatById, handleGetChatsByUser, handleGetMessage, handleGetMessagesByChatAndUser, handlePostChat, handlePostMessage } from '../controllers/chatsController'; // Adjust the import path as necessary
import { authenticate } from '../../middlewares';

const chatsRoute = express.Router();

chatsRoute.get('/messages/:messageId', authenticate, handleGetMessage);
chatsRoute.get('/:chatId', authenticate, handleGetChatById);
chatsRoute.get('/user', authenticate, handleGetChatsByUser);
chatsRoute.get('/:chatId/messages', authenticate, handleGetMessagesByChatAndUser);

chatsRoute.post('/:chatId/messages', authenticate, handlePostMessage);
chatsRoute.post('/', authenticate, handlePostChat);

chatsRoute.delete('/:chatId', authenticate, handleDeleteChat);

export default chatsRoute;
