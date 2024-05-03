import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Job, Swipe} from '@sharedTypes/DBTypes';
import {MessageResponse, SwipeResponse} from '@sharedTypes/MessageTypes';
import {getUser} from './userModel';
import {getSwipeById} from '../controllers/swipesController';
import {postMatch} from './matchModel';
import {postApplication} from './applicationModel';

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
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Swipes (swiper_id, swiped_id, swipe_direction, swipe_type) VALUES (?, ?, ?, ?)',
      [user_id, swipe.swiped_id, swipe.swipe_direction, swipe.swipe_type]
    );
    if (!result) {
      throw new Error('Failed to post swipe');
    }
    console.log(result, 'result');
    const insertId = result.insertId;
    const newSwipe = await getSwipeBySwipeId(insertId);
    console.log(newSwipe, 'newSwipe');
    if (!newSwipe) {
      throw new Error('Failed to get new swipe');
    }
    if (
      newSwipe.swipe_direction === 'right' &&
      newSwipe.swipe_type === 'candidate'
    ) {
      const candidateUser = await getUser(newSwipe.swiped_id);
      if (!candidateUser) {
        throw new Error('Candidate user not found');
      }
      const sqlCheck =
        'SELECT * FROM Swipes WHERE swiper_id = ? AND swiped_id = ?';
      const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
        sqlCheck,
        [candidateUser.user_id, newSwipe.swiped_id]
      );
      console.log(result, 'result');
      if (result.length === 0) {
        return {message: 'Swipe posted', swipe: newSwipe};
      }
      // if there is a match, post the match
      const match = await postMatch(candidateUser.user_id, newSwipe.swiped_id);
      if (!match) {
        throw new Error('Failed to post match');
      }
      console.log(match, 'match');
    }
    if (newSwipe.swipe_direction === 'right' && newSwipe.swipe_type === 'job') {
      // create an application for the job
      const createApplication = await postApplication(
        newSwipe.swiper_id,
        newSwipe.swiped_id
      );
      if (!createApplication) {
        throw new Error('Failed to create application');
      }
      // getting user id from the job id
      const jobUserSql = 'SELECT user_id FROM JobAds WHERE job_id = ?';
      const jobUserResult = await promisePool.execute<RowDataPacket[] & Job[]>(
        jobUserSql,
        [newSwipe.swiped_id]
      );
      if (!jobUserResult) {
        throw new Error('Job user not found');
      }
      const sqlCheck =
        'SELECT * FROM Swipes WHERE swiper_id = ? AND swiped_id = ?';
      const [result] = await promisePool.execute<RowDataPacket[] & Swipe[]>(
        sqlCheck,
        [jobUserResult[0][0].user_id, newSwipe.swiper_id]
      );
      console.log(result, 'result');
      if (result.length === 0) {
        return {message: 'Swipe posted', swipe: newSwipe};
      }
      const match = await postMatch(
        newSwipe.swiper_id,
        jobUserResult[0][0].user_id
      );
      if (!match) {
        throw new Error('Failed to post match');
      }
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
