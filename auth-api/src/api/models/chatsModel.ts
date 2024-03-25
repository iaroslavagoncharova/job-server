import {Chats, Message} from '@sharedTypes/DBTypes';
import {promisePool} from '../../lib/db';
import {RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';

const getChatsByUser = async (userId: number): Promise<Chats[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Chats[]>(
    'SELECT * FROM UserChats WHERE user_id = ?',
    [userId]
  );
  if (rows.length === 0) {
    throw new CustomError('Chats not found', 404);
  }
  return rows;
};

const getMessagesByChatAndUser = async (
  chatId: number,
  userId: number
): Promise<Message[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Message[]>(
    `SELECT * FROM Messages WHERE chat_id = ? AND user_id = ?`,
    [chatId, userId]
  );
  if (rows.length === 0) {
    throw new CustomError('Messages not found', 404);
  }
  return rows;
};

export {getChatsByUser, getMessagesByChatAndUser};
