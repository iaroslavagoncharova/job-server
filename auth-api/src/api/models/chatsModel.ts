import {promisePool} from '../../lib/db';
import {Message, Chat, TokenContent, Match} from '@sharedTypes/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import CustomError from '../../classes/CustomError';

// get a message by id
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

// get the other user in a chat
const getOtherChatUser = async (chatId: number, userId: number): Promise<number | null> => {
  try {
    const [chat] = await promisePool.execute<RowDataPacket[] & Chat[]>('SELECT * FROM Chats WHERE chat_id = ?', [chatId]);
    if (chat.length === 0) {
      return null;
    }
    if (chat[0].user1_id === userId) {
      return chat[0].user2_id;
    } else if (chat[0].user2_id === userId) {
      return chat[0].user1_id;
    } else {
      return null;
    }
  } catch (e) {
    throw new Error('getOtherChatUser error' + (e as Error).message);
  }
};

// get a chat by id
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

// getting chats for a user
const getChatsByUser = async (userId: number): Promise<Chat[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Chat[]>(
    'SELECT * FROM Chats WHERE user1_id = ? OR user2_id = ?',
    [userId, userId]
  );
  if (rows.length === 0) {
    throw new CustomError('Chats not found', 404);
  }
  return rows;
};

// get all info about messages in a chat, if a user is an owner, display right, if not, display left
const getMessagesByChatAndUser = async (
  chatId: number,
  userId: number
) => {
  const otherUserId = await getOtherChatUser(chatId, userId);
  if (!otherUserId) {
    throw new CustomError('Chat not found', 404);
  }
  const [myMessages] = await promisePool.execute<RowDataPacket[] & Message[]>(
    `SELECT * FROM Messages WHERE chat_id = ? AND user_id = ? ORDER BY sent_at;`,
    [chatId, userId]
  );
  const [theirMessages] = await promisePool.execute<RowDataPacket[] & Message[]>(`
    SELECT * FROM Messages WHERE chat_id = ? AND user_id = ? ORDER BY sent_at;`,
    [chatId, otherUserId]
  );
  if (myMessages.length === 0 && theirMessages.length === 0) {
    throw new CustomError('Messages not found', 404);
  }

  // returns an array of two arrays, first array is messages of the user, second array is messages of the other user
  return [myMessages, theirMessages];
};

// sending a message to a chat
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

// start a chat - automatically after a match or manually after an employer approves an application
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

// delete a chat
const deleteChat = async (chatId: number, user: TokenContent): Promise<MessageResponse> => {
  const chat = await getChatById(chatId);

  if (!chat) {
    return {message: 'Chat not found'};
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await promisePool.execute(`DELETE FROM Messages WHERE chat_id = ?`, [chatId]);
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

export {getMessage, getOtherChatUser, getChatById, getChatsByUser, getMessagesByChatAndUser, postMessage, postChat, deleteChat};
