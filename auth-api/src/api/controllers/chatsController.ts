import { Request, Response, NextFunction } from 'express';
import { getChatsByUser, getMessagesByChatAndUser } from '../models/chatsModel';

export const handleGetChatsByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = res.locals.user.user_id;
        const chats = await getChatsByUser(userId);
        res.json(chats);
    } catch (error) {
        next(error);
    }
};

export const handleGetMessagesByChatAndUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const chatId = parseInt(req.params.chatId, 10);
        const userId = res.locals.user.user_id;
        const messages = await getMessagesByChatAndUser(chatId, userId);
        res.json(messages);
    } catch (error) {
        next(error);
    }
};
