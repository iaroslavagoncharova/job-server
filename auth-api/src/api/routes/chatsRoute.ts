import express from 'express';
import { handleGetChatsByUser, handleGetMessagesByChatAndUser } from '../controllers/chatsController'; // Adjust the import path as necessary
import { authenticate } from '../../middlewares';

const chatsRoute = express.Router();

chatsRoute.get('/user', authenticate, handleGetChatsByUser);
chatsRoute.get('/messages/:chatId', authenticate, handleGetMessagesByChatAndUser);

export default chatsRoute;
