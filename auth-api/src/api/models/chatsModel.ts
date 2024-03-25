import {promisePool} from '../../lib/db';
import {Message, Chat, UserChat, TokenContent, Match} from '@sharedTypes/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import CustomError from '../../classes/CustomError';

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


const getChatsByUser = async (userId: number): Promise<UserChat[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserChat[]>(
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

const postMessage = async (message: Pick<Message, 'user_id' | 'chat_id' | 'message_text'>): Promise<Message | null> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(`
      INSERT INTO Messages (user_id, chat_id, message_text)
      VALUES (?, ?, ?);`,
      [message.user_id, message.chat_id, message.message_text]
    );
    console.log(result);
    const [rows] = await promisePool.execute<RowDataPacket[] & Message[]>(
      'SELECT * FROM Messages WHERE message_id = ?',
      [result[0].insertId]
    );

    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postChat = async (matchId: number): Promise<Chat | null> => {
  try {
    const [userIds] = await promisePool.execute<RowDataPacket[] & Pick<Match, 'user1_id' | 'user2_id'>>(`
    SELECT user1_id, user2_id FROM Matches WHERE match_id = ?`,
    [matchId]
    );
    if (userIds.length === 0) {
      return null;
    }
    const user1_id = userIds[0];
    const user2_id = userIds[1];

    const chat = await promisePool.execute<ResultSetHeader>(`INSERT INTO Chats (user1_id, user2_id) VALUES (?, ?)`, [user1_id, user2_id]);
    const [rows] = await promisePool.execute<RowDataPacket[] & Chat[]>(
      'SELECT * FROM Chats WHERE chat_id = ?',
      [chat[0].insertId]
    );
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
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
