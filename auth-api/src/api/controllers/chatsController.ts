import {Request, Response, NextFunction} from 'express';
import {
  acceptInterviewInvitation,
  declineInterviewInvitation,
  deleteChat,
  getChatById,
  getChatsByUser,
  getMessage,
  getMessagesByChatAndUser,
  getOtherChatUser,
  postAdminChat,
  postChat,
  postMessage,
  sendInterviewInvitation,
} from '../models/chatsModel';
import CustomError from '../../classes/CustomError';
import {
  Chat,
  Message,
  MessageWithUser,
  PostMessage,
  TokenContent,
  User,
} from '@sharedTypes/DBTypes';
import {ChatResponse, MessageResponse} from '@sharedTypes/MessageTypes';

// toimii
export const handleGetMessage = async (
  req: Request,
  res: Response<Message>,
  next: NextFunction
): Promise<Message | void> => {
  try {
    const messageId = parseInt(req.params.messageId);
    const message = await getMessage(messageId);
    if (message === null) {
      next(new CustomError('Message not found', 404));
      return;
    }
    res.json(message);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export const handleGetOtherChatUser = async (
  req: Request<{chatId: string}>,
  res: Response,
  next: NextFunction
): Promise<Pick<User, 'username' | 'user_id'> | void> => {
  try {
    const chat_id = parseInt(req.params.chatId);
    const user_id = parseInt(res.locals.user.user_id);
    const otherUser = await getOtherChatUser(chat_id, user_id);
    if (otherUser === null) {
      next(new CustomError('Message not found', 404));
      return;
    }
    res.json(otherUser);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

// toimii
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
    next(new CustomError((e as Error).message, 500));
  }
};

// toimii
export const handleGetChatsByUser = async (
  req: Request,
  res: Response<Chat[]>,
  next: NextFunction
): Promise<Chat[] | void> => {
  try {
    const userId = res.locals.user.user_id;
    const chats = await getChatsByUser(parseInt(userId));
    if (chats === null) {
      next(new CustomError('Chats not found', 404));
      return;
    }
    res.json(chats);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

// toimii
export const handleGetMessagesByChatAndUser = async (
  req: Request<{chatId: string}>,
  res: Response<MessageWithUser[]>,
  next: NextFunction
) => {
  try {
    const chatId = parseInt(req.params.chatId);
    const user_id = res.locals.user.user_id;
    const messages = await getMessagesByChatAndUser(chatId, user_id);
    if (messages === null) {
      next(new CustomError('Messages not found', 404));
      return;
    }
    res.json(messages);
  } catch (error) {
    next(new CustomError('Failed to get messages', 500));
  }
};

// toimii
export const handlePostMessage = async (
  req: Request<{}, {}, Pick<Message, 'chat_id' | 'message_text'>>,
  res: Response<ChatResponse, {user: TokenContent}>,
  next: NextFunction
): Promise<Message | void> => {
  try {
    const userId = res.locals.user.user_id;
    const message: PostMessage = {...req.body, user_id: userId};
    const newMessage = await postMessage(message);
    if (newMessage === null) {
      next(new CustomError('Message not created', 404));
      return;
    }
    res.json({message: 'Message sent', media: newMessage});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// toimii
export const handlePostChat = async (
  req: Request<{}, {}, {match_id: number}>,
  res: Response<Chat>,
  next: NextFunction
): Promise<Chat | void> => {
  try {
    const chat = await postChat(req.body.match_id);
    if (chat === null) {
      next(new CustomError('Chat not created', 500));
      return;
    }
    res.json(chat);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const handlePostAdminChat = async (
  req: Request,
  res: Response<Chat>,
  next: NextFunction
): Promise<Chat | void> => {
  try {
    const tokenUser = res.locals.user;
    const chat = await postAdminChat(tokenUser.user_id);
    if (chat === null) {
      next(new CustomError('Chat not created', 404));
      return;
    }
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// toimii
export const handleDeleteChat = async (
  req: Request<{chatId: string}>,
  res: Response<MessageResponse | null>,
  next: NextFunction
) => {
  try {
    const userId = res.locals.user.user_id;
    const chatId = parseInt(req.params.chatId);
    const result = await deleteChat(chatId, userId);
    if (result) {
      res.json({message: 'Chat deleted'});
      return;
    }
    next(new CustomError('Failed to delete chat', 500));
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const handleSendInterviewInvitation = async (
  req: Request<{chatId: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = res.locals.user.user_id;
    console.log(userId);
    const chat = await sendInterviewInvitation(chatId, userId);
    if (!chat) {
      next(new CustomError('Failed to send interview invitation', 500));
      return;
    }
    res.json({message: 'Interview invitation sent'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export const handleAcceptInterviewInvitation = async (
  req: Request<{chatId: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = res.locals.user.user_id;
    console.log(userId);
    const chat = await acceptInterviewInvitation(chatId, userId);
    if (!chat) {
      next(new CustomError('Failed to accept interview invitation', 500));
      return;
    }
    res.json({message: 'Interview invitation accepted'});
  } catch (error) {
    next(error);
  }
};

export const handleDeclineInterviewInvitation = async (
  req: Request<{chatId: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const chatId = parseInt(req.params.chatId);
    const userId = res.locals.user.user_id;
    console.log(userId);
    const chat = await declineInterviewInvitation(chatId, userId);
    if (!chat) {
      next(new CustomError('Failed to decline interview invitation', 500));
      return;
    }
    res.json({message: 'Interview invitation declined'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};
