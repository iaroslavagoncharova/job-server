import {promisePool} from '../../lib/db';
import {Message, Chat, Match, MessageWithUser, User, PostMessage} from '@sharedTypes/DBTypes';
import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import CustomError from '../../classes/CustomError';
import {deleteMatch} from './matchModel';

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
const getOtherChatUser = async (chatId: number, userId: number): Promise<Pick<User, 'username' | 'user_id'> | null> => {
  try {
    const [chat] = await promisePool.execute<RowDataPacket[] & Chat[]>('SELECT * FROM Chats WHERE chat_id = ?', [chatId]);
    if (chat.length === 0) {
      return null;
    }
    if (chat[0].user1_id === userId) {
      const [otherUser] = await promisePool.execute<RowDataPacket[] & Pick<User, 'user_id' | 'username'>[]>(
        'SELECT user_id, username FROM Users WHERE user_id = ?',
        [chat[0].user2_id]
      );
      return otherUser[0];
    }
    if (chat[0].user2_id === userId) {
      const [otherUser] = await promisePool.execute<RowDataPacket[] & Pick<User, 'user_id' | 'username'>[]>(
        'SELECT user_id, username FROM Users WHERE user_id = ?',
        [chat[0].user1_id]
      );
      return otherUser[0];
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
  const otherUser = await getOtherChatUser(chatId, userId);
  if (!otherUser) {
    throw new CustomError('Other chat user not found', 404);
  }

  const otherUserId = otherUser.user_id;

  // MY MESSAGES FROM CHAT
  const [myMessages] = await promisePool.execute<RowDataPacket[] & Message[]>(
    `SELECT * FROM Messages WHERE chat_id = ? AND user_id = ? ORDER BY sent_at;`,
    [chatId, userId]
  );
  const [me] = await promisePool.execute<RowDataPacket[] & Pick<User, 'username'>>(
    'SELECT username FROM Users WHERE user_id = ?',
    [userId]
  );
  let meAndMyMessages: MessageWithUser[] | null = [];

  // THEIR MESSAGES FROM CHAT
  const [theirMessages] = await promisePool.execute<RowDataPacket[] & Message[]>(`
    SELECT * FROM Messages WHERE chat_id = ? AND user_id = ? ORDER BY sent_at;`,
    [chatId, otherUserId]
  );
  const [them] = await promisePool.execute<RowDataPacket[] & Pick<User, 'username'>>(
    'SELECT username FROM Users WHERE user_id = ?',
    [otherUserId]
  );
  let themAndTheirMessages: MessageWithUser[] | null = [];

  if (myMessages.length === 0 && theirMessages.length === 0) {
    return null;
  }
  if (myMessages.length === 0) {
    meAndMyMessages = [];
  } else {
    for (let message of myMessages) {
      let meAndMessage = {...message, username: me[0].username}
      meAndMyMessages.push(meAndMessage);
    };
  }
  if (theirMessages.length === 0) {
    themAndTheirMessages = [];
  } else {
    for (let message of theirMessages) {
      const themAndMessage = {...message, username: them[0].username}
      themAndTheirMessages.push(themAndMessage);
    }
  }

  // returns an array of two arrays, first array is messages of the user, second array is messages of the other user
  return [(meAndMyMessages), (themAndTheirMessages)].flat().sort((a, b) => {
    return a.sent_at < b.sent_at ? -1 : 1;
  });
};

// sending a message to a chat
const postMessage = async (message: PostMessage): Promise<Message | null> => {
  try {
    const result = await promisePool.execute<ResultSetHeader>(`
      INSERT INTO Messages (user_id, chat_id, message_text)
      VALUES (?, ?, ?);`,
      [message.user_id, message.chat_id, message.message_text]
    );
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
    const user1_id = userIds[0].user1_id;
    const user2_id = userIds[0].user2_id;

    const chat = await promisePool.execute<ResultSetHeader>(`INSERT INTO Chats (user1_id, user2_id) VALUES (?, ?)`, [user1_id, user2_id]);
    if (chat[0].affectedRows === 0) {
      return null;
    }
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
const deleteChat = async (chatId: number, userId: number): Promise<MessageResponse> => {
  console.log('deleteChat entered');
  const chat = await getChatById(chatId);

  if (!chat) {
    return {message: 'Chat not found'};
  }

  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    console.log('transaction started');
    await promisePool.execute(`DELETE FROM Messages WHERE chat_id = ?`, [chatId]);
    console.log('deleted messages');
    const [result] = await promisePool.execute<ResultSetHeader>(`DELETE FROM Chats WHERE chat_id = ? AND (user1_id = ? OR user2_id = ?);`, [chatId, userId, userId]);
    console.log('deleted chat');

    if (result.affectedRows === 0) {
      return {message: 'Chat not deleted'};
    }

    await connection.commit();
    console.log('committed transaction');

    return {message: 'Chat deleted'};
  } catch (e) {
    await connection.rollback();
    throw new Error((e as Error).message);
  } finally {
    connection.release();
    console.log('connection released');
  }
};

export {getMessage, getOtherChatUser, getChatById, getChatsByUser, getMessagesByChatAndUser, postMessage, postChat, deleteChat};
