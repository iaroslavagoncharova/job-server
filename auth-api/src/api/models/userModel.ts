import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {UnauthorizedUser, UpdateUser, User} from '../../../../hybrid-types/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getUsers = async (): Promise<UnauthorizedUser[] | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >('SELECT * FROM Users');
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUser = async (id: number): Promise<UnauthorizedUser | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & UnauthorizedUser[]
    >('SELECT * FROM Users WHERE user_id = ?', [id]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & User[]>(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postUser = async (
  user: Pick<User, 'password' | 'email' | 'fullname' | 'phone' | 'user_type'>
): Promise<UnauthorizedUser | null> => {
  try {
    const username = 'test';
    const result = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        username,
        user.password,
        user.email,
        2,
        user.fullname,
        user.phone,
        user.user_type,
      ]
    );
    console.log(result);
    const createdUser = await getUser(result[0].insertId);
    return createdUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const putUser = async (
  id: number,
  user: UpdateUser
): Promise<UnauthorizedUser | null> => {
  try {
    const updateInfo: UpdateUser = {};
    if (user.email !== undefined) {
      updateInfo.email = user.email;
    }
    if (user.fullname !== undefined) {
      updateInfo.fullname = user.fullname;
    }
    if (user.phone !== undefined) {
      updateInfo.phone = user.phone;
    }
    if (user.password !== undefined) {
      updateInfo.password = user.password;
    }
    if (user.address !== undefined) {
      updateInfo.address = user.address;
    }
    if (user.about_me !== undefined) {
      updateInfo.about_me = user.about_me;
    }
    console.log(updateInfo);
    const sql = promisePool.format(
      'UPDATE Users SET ? WHERE user_id = ?',
      [updateInfo, id]
    );
    console.log(sql);
    const result = await promisePool.execute<ResultSetHeader>(sql);
    if (result[0].affectedRows === 0) {
      return null;
    }
    const updatedUser = await getUser(id);
    return updatedUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteUser = async (id: number): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM JobExperience WHERE user_id = ?', [
      id,
    ]);
    await connection.execute('DELETE FROM Education WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM Attachments WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM JobAds WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM UserSkills WHERE user_id = ?', [id]);
    // delete application links that have application id that has user id
    await connection.execute(
      'DELETE FROM ApplicationLinks WHERE application_id IN (SELECT application_id FROM Applications WHERE user_id = ?)',
      [id]
    );
    await connection.execute('DELETE FROM Applications WHERE user_id = ?', [
      id,
    ]);
    await connection.execute('DELETE FROM Tests WHERE user_id = ?', [id]);
    await connection.execute('DELETE FROM UserTests WHERE user_id = ?', [id]);
    // delete messages that have user id and are from the chats that have user id
    await connection.execute(
      'DELETE FROM Messages WHERE chat_id IN (SELECT chat_id FROM Chats WHERE user1_id = ? OR user2_id = ?)',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Chats WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Swipes WHERE swiped_id = ? OR swiper_id = ?',
      [id, id]
    );
    //delete from notifications that are from the matches that have user id
    await connection.execute(
      'DELETE FROM Notifications WHERE match_id IN (SELECT match_id FROM Matches WHERE user1_id = ? OR user2_id = ?)',
      [id, id]
    );
    await connection.execute(
      'DELETE FROM Matches WHERE user1_id = ? OR user2_id = ?',
      [id, id]
    );
    await connection.execute('DELETE FROM Reports WHERE user_id = ?', [id]);
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      throw new Error('User not deleted');
    }
    await connection.commit();
    return {message: 'User deleted'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {getUsers, getUser, postUser, getUserByEmail, deleteUser, putUser};

