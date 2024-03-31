import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Match} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

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
    const [result] = await promisePool.execute<RowDataPacket[] & Match[]>(
      'SELECT * FROM Matches WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    if (result.length === 0) {
      return null;
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
    return {message: 'Match created'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteMatch = async (id: number): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM Notifications WHERE match_id = ?', [
      id,
    ]);
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