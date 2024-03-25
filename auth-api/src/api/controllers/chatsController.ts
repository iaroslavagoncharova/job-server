import {Request, Response, NextFunction} from 'express';
import {getChatsByUser, getMessagesByChatAndUser} from '../models/chatsModel';
import CustomError from '../../classes/CustomError';
import {Chats, Message} from '@sharedTypes/DBTypes';

export const handleGetChatsByUser = async (
  req: Request,
  res: Response<Chats[]>,
  next: NextFunction
): Promise<Chats[] | void> => {
  try {
    const userId = res.locals.user.user_id;
    const chats = await getChatsByUser(userId);
    if (chats === null) {
      next(new CustomError('Chats not found', 404));
      return;
    }
    res.json(chats);
  } catch (error) {
    next(error);
  }
};

export const handleGetMessagesByChatAndUser = async (
  req: Request<{chatId: string}>,
  res: Response<Message[]>,
  next: NextFunction
): Promise<Message[] | void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const tokenUser = res.locals.user;
    const messages = await getMessagesByChatAndUser(tokenUser.user_id, chatId);
    if (messages === null) {
      next(new CustomError('Messages not found', 404));
      return;
    }
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
