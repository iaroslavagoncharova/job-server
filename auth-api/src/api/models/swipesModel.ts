import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Swipe} from '@sharedTypes/DBTypes';
import {MessageResponse, SwipeResponse} from '@sharedTypes/MessageTypes';
import {getUser} from './userModel';
import {getSwipeById} from '../controllers/swipesController';

const getSwipes = async (): Promise<Swipe[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getSwipesByUser = async (id: number): Promise<Swipe[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes WHERE swiper_id = ?',
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getRightSwipes = async (): Promise<Swipe[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes WHERE swipe_direction = "Right"'
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getSwipeBySwipeId = async (id: number): Promise<Swipe | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes WHERE swipe_id = ?',
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getRightSwipesByUser = async (id: number): Promise<Swipe[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes WHERE swiper_id = ? AND swipe_direction = "Right"',
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getSwipeByUserId = async (id: number): Promise<Swipe | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
      'SELECT * FROM Swipes WHERE swiper_id = ? OR swiped_id = ?',
      [id, id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const postSwipe = async (
  user_id: number,
  swipe: Omit<Swipe, 'swipe_id' | 'swiper_id' | 'created_at'>
): Promise<SwipeResponse> => {
  try {
    console.log(user_id, swipe);
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Swipes (swiper_id, swiped_id, swipe_direction, swipe_type) VALUES (?, ?, ?, ?)',
      [user_id, swipe.swiped_id, swipe.swipe_direction, swipe.swipe_type]
    );
    console.log();
    if (!result) {
      throw new Error('Failed to post swipe');
    }
    const insertId = result.insertId;
    const newSwipe = await getSwipeBySwipeId(insertId);
    if (!newSwipe) {
      throw new Error('Failed to get new swipe');
    }
    return {message: 'Swipe posted', swipe: newSwipe};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteSwipe = async (id: number): Promise<MessageResponse | null> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Swipes WHERE swipe_id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return null;
    }
    return {message: 'Swipe deleted'};
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {
  getSwipes,
  getSwipesByUser,
  getRightSwipes,
  getRightSwipesByUser,
  getSwipeByUserId,
  deleteSwipe,
  getSwipeBySwipeId,
  postSwipe,
};
