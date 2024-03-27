import {Request, Response, NextFunction} from 'express';
import {deleteChat, getChatById, getChatsByUser, getMessage, getMessagesByChatAndUser, postChat, postMessage} from '../models/chatsModel';
import CustomError from '../../classes/CustomError';
import {Chat, Message, TokenContent} from '@sharedTypes/DBTypes';
import {ChatResponse} from '@sharedTypes/MessageTypes';

export const handleGetMessage = async (
  req: Request,
  res: Response<Message>,
  next: NextFunction
  ): Promise<Message | void>  => {
    try {
      const messageId = parseInt(req.params.messageId);
      const message = await getMessage(messageId);
      if (message === null) {
        next(new CustomError('Message not found', 404));
        return;
      }
      res.json(message);
    } catch (e) {
      next(e);
    }
};

export const handleGetChatById = async (
  req: Request<{chatId: string}>,
  res: Response<Chat>,
  next: NextFunction
): Promise<Chat | void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const chat = await getChatById(chatId);
    if (chat === null) {
      next(new CustomError('Chat not found', 404));
      return;
    }
    res.json(chat);
  } catch (e) {
    next(e);
  }
};

export const handleGetChatsByUser = async (
  req: Request,
  res: Response<Chat[]>,
  next: NextFunction
): Promise<Chat[] | void> => {
  try {
    const userId = res.locals.user.user_id;
    const chats = await getChatsByUser(userId);
    if (chats === null) {
      next(new CustomError('Chats not found', 404));
      return;
    }
    res.json(chats);
  } catch (e) {
    next(e);
  }
};

export const handleGetMessagesByChatAndUser = async (
  req: Request<{chatId: string}>,
  res: Response,
  next: NextFunction
) => {
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

export const handlePostMessage = async (
  req: Request<{}, {}, Pick<Message, 'user_id' | 'chat_id' | 'message_text'>>,
  res: Response<ChatResponse, {user: TokenContent}>,
  next: NextFunction
): Promise<Message | void> => {
  try {
    req.body.user_id = res.locals.user.user_id;
    const message = req.body;
    const newMessage = await postMessage(message);
    if (newMessage === null) {
      next(new CustomError('Message not created', 404));
      return;
    }
    res.json({message: 'Message sent', media: newMessage});
  } catch (error) {
    next(error);
  }
};

export const handlePostChat = async (
  req: Request<{}, {}, {match_id: number}>,
  res: Response<Chat>,
  next: NextFunction
): Promise<Chat | void> => {
  try {
    const chat = await postChat(req.body.match_id);
    if (chat === null) {
      next(new CustomError('Chat not created', 404));
      return;
    }
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteChat = async (
  req: Request<{chatId: string}>,
  res: Response<{message: string}>,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user.user_id;
    const chatId = parseInt(req.params.chatId);
    const chat = await getChatById(chatId);
    if (chat === null) {
      next(new CustomError('Chat not found', 404));
      return;
    }
    await deleteChat(chatId, userId);
    res.json({message: 'Chat deleted'});
  } catch (error) {
    next(error);
  }
};
