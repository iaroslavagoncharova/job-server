import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Chat, Match, MatchWithUser} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {getUserById} from '../controllers/userController';
import {getUser} from './userModel';
import {postChat} from './chatsModel';

const getMatches = async (): Promise<Match[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Match[]>(
      'SELECT * FROM Matches'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getMatchesByUser = async (id: number): Promise<Match[] | null> => {
  try {
    // select all matches where user1_id or user2_id is the id, if user1 is the id, select user2, if user2 is the id, select user1
    const [result] = await promisePool.execute<RowDataPacket[] & Match[]>(
      'SELECT * FROM Matches WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    if (result.length === 0) {
      return null;
    }
    for (const match of result) {
      if (match.user1_id === id) {
        const user = await getUser(match.user2_id);
        match.user = user;
        const response = {
          match: result,
          user: user,
        };
      } else {
        const user = await getUser(match.user1_id);
        match.user = user;
        const response = {
          match: result,
          user: user,
        };
      }
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postMatch = async (
  user1_id: number,
  user2_id: number
): Promise<MessageResponse> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Matches (user1_id, user2_id) VALUES (?, ?)',
      [user1_id, user2_id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Match not created');
    }
    // check if there is an application (if a user has applied to another user's job)
    const checkApplication = await promisePool.execute<RowDataPacket[]>(
      'SELECT * FROM Applications where user_id = ? AND job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?) OR user_id = ? AND job_id IN (SELECT job_id FROM JobAds WHERE user_id = ?)',
      [user1_id, user2_id, user2_id, user1_id]
    );
    console.log(checkApplication[0]);
    if (checkApplication[0].length > 0) {
      // set applications status to Accepted
      const updateStatus = await promisePool.execute<ResultSetHeader>(
        'UPDATE Applications SET status = "Accepted" WHERE user_id = ? AND application_id = ?',
        [checkApplication[0][0].user_id, checkApplication[0][0].application_id]
      );
      if (updateStatus[0].affectedRows === 0) {
        throw new Error('Application status not updated');
      }
      console.log('Application status updated');
    }
    // check if a chat aready exists between the two users
    const checkChat = await promisePool.execute<RowDataPacket[] & Chat[]>(
      'SELECT * FROM Chats WHERE user1_id = ? AND user2_id = ? OR user1_id = ? AND user2_id = ?',
      [user1_id, user2_id, user2_id, user1_id]
    );
    if (checkChat[0].length > 0) {
      return {message: 'Match created'};
    }
    // if no chat exists, create a chat
    const createChat = await postChat(result.insertId);
    if (!createChat) {
      throw new Error('Chat not created');
    }
    return {message: 'Match created'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteMatch = async (id: number): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Matches WHERE match_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Match not deleted');
    }
    await connection.commit();
    return {message: 'Match deleted'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};
export {getMatches, getMatchesByUser, postMatch, deleteMatch};
