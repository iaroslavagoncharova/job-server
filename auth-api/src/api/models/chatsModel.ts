import {promisePool} from '../../lib/db';
import {Message, Chat, UserChat, TokenContent} from '../../../../hybrid-types/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getMessage = async (messageId: number): Promise<Message | null> => {
  try {
    const [result] = await promisePool.execute<
    RowDataPacket[] & Message[]
    >('SELECT * FROM Messages WHERE message_id = ?',
    [messageId]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getChatById = async (chatId: number): Promise<Chat | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Chat[]>('SELECT * FROM Chats WHERE chat_id = ?', [chatId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    throw new Error('getChatById error' + (e as Error).message);
  }
};

const getChatsByUser = async (userId: number): Promise<any[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserChat>('SELECT * FROM UserChats WHERE user_id = ?', [userId]);
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

const postMessage = async (message: Pick<Message, 'user_id' | 'chat_id' | 'message_text'>): Promise<Message | null> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(`
    INSERT INTO Messages (user_id, chat_id, message_text)
    VALUES (?, ?, ?);`,
    [message.user_id, message.chat_id, message.message_text]);
    console.log(result);
    const createdMessage = await getMessage(result[0].insertId);
    return createdMessage;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postChat = async (matchId: number): Promise<Chat | null> => {
  try {
    const userIds = await promisePool.execute(`
    SELECT user1_id, user2_id FROM Matches WHERE match_id = ?`,
    [matchId]);
    const user1_id = userIds[0];
    const user2_id = userIds[1];

    const chat = await promisePool.execute<ResultSetHeader>(`INSERT INTO Chats (user1_id, user2_id) VALUES (?, ?)`, [user1_id, user2_id]);
    const createdChat = await getChatById(chat[0].insertId);
    if (!createdChat) {
      return null;
    }
    const chat_id = createdChat?.chat_id;

    const userChats = await promisePool.execute<ResultSetHeader>(`
      INSERT INTO UserChats (user_id, chat_id)
      VALUES (?, ?), (?, ?);
    `, [user1_id, chat_id, user2_id, chat_id]);

    return createdChat;

  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteChat = async (chatId: number, user: TokenContent): Promise<MessageResponse> => {
  const chat = await getChatById(chatId);

  if (!chat) {
    return {message: 'Chat not found'};
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await promisePool.execute(`DELETE FROM Messages WHERE chat_id = ?`, [chatId]);
    await promisePool.execute(`DELETE FROM UserChats WHERE chat_id = ?`, [chatId]);
    const [result] = await promisePool.execute<ResultSetHeader>(`DELETE FROM Chats WHERE chat_id = ? AND user_id = ?;`, [chatId, user.user_id]);

    if (result.affectedRows === 0) {
      return {message: 'Chat not deleted'};
    }

    await connection.commit();

    return {message: 'Chat deleted'};
  } catch (e) {
    await connection.rollback();
    throw new Error((e as Error).message);
  } finally {
    connection.release();
  }
};




export {getMessage, getChatById, getChatsByUser, getMessagesByChatAndUser, postMessage, postChat, deleteChat};
