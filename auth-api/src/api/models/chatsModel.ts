import {promisePool} from '../../lib/db';

const getChatsByUser = async (userId: number): Promise<any[]> => {
  const [rows] = await promisePool.execute('SELECT * FROM Chats WHERE user_id = ?', [userId]);
  return rows as any[];
};

const getMessagesByChatAndUser = async (chatId: number, userId: number): Promise<any[]> => {
  const [rows] = await promisePool.execute(`
      SELECT Messages.*,
      CASE WHEN Messages.user_id = ? THEN 'right' ELSE 'left' END as message_side
      FROM Messages
      WHERE chat_id = ?`,
      [userId, chatId]);
  return rows as any[];
};

export { getChatsByUser, getMessagesByChatAndUser };
