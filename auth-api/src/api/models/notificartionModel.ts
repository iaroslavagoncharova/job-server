import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Match, Notification, UnauthorizedUser} from '@sharedTypes/DBTypes';
import {MessageResponse, NotificationResponse} from '@sharedTypes/MessageTypes';

const getNotificationsByUser = async (
  id: number
): Promise<NotificationResponse[] | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & Notification[]
    >(
      // select all notifications, then select the match id from the notification and choose
      'SELECT * FROM Notifications WHERE match_id IN (SELECT match_id FROM Matches WHERE user1_id = ? OR user2_id = ?)',
      [id, id]
    );
    if (result.length === 0) {
      return null;
    }
    const [match] = await promisePool.execute<RowDataPacket[] & Match>(
      'SELECT * FROM Matches WHERE match_id = ?',
      [result[0].match_id]
    );
    if (!match) {
      throw new Error('Match not found');
    }
    const user2_id = match[0].user2_id;
    const [user] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >('SELECT * FROM Users WHERE user_id = ?', [user2_id]);
    if (user.length === 0) {
      throw new Error('User not found');
    }
    const matchUser = user[0];
    const response: NotificationResponse = {
      message: 'Looks like you have a new match!',
      notification: result,
      user: matchUser,
    };
    return [response];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postNotification = async (match_id: number): Promise<MessageResponse> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Notifications (match_id) VALUES (?)',
      [match_id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Notification not created');
    }
    return {message: 'Notification created'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteNotification = async (
  id: number
): Promise<MessageResponse | null> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Notifications WHERE notification_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Notification deleted'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {getNotificationsByUser, postNotification, deleteNotification};
