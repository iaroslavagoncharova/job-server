import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {UnauthorizedUser, User} from '../../../../hybrid-types/DBTypes';
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
    const [result] = await promisePool.execute<
      RowDataPacket[] & User[]
    >('SELECT * FROM Users WHERE email = ?', [email]);
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postUser = async (user: Pick<User, 'password' | 'email' | 'fullname' | 'phone' |'user_type'>): Promise<UnauthorizedUser | null> => {
  try {
    const username = 'test';
    const result = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Users (username, password, email, user_level_id, fullname, phone, user_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, user.password, user.email, 2, user.fullname, user.phone, user.user_type]
    );
    console.log(result);
    const createdUser = await getUser(result[0].insertId);
    return createdUser;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {getUsers, getUser, postUser, getUserByEmail};

// - getUserByEmail (email)
// - getUserByToken (token)
// - postUser (user info)
// - putUser (authenticate, user_id from token, email | fullname | phone | password | address)
// - deleteUser (authenticate, user_id from token)
