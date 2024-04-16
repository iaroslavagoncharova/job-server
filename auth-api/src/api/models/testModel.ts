import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Test} from '../../../../hybrid-types/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// get all tests
const getTests = async (): Promise<Test[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM Tests'
    );
    if (result.length === 0) {
      return null;
    }
    if (!result) {
      throw new Error('Error getting tests');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting tests');
  }
};

// get tests by user
const getTestsByUser = async (userId: number): Promise<Test[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM Tests WHERE user_id = ?',
      [userId]
    );
    if (result.length === 0) {
      return null;
    }
    if (!result) {
      throw new Error('Error getting tests');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting tests');
  }
};

// post test
const postTest = async (test: Test): Promise<MessageResponse> => {
  try {
    if (test.user_id === null) {
      const [nullResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Tests (test_type, test_link) VALUES (?, ?)',
        [test.test_type, test.test_link]
      );
      if (nullResult) {
        return {message: 'Test posted'};
      } else {
        throw new Error('Error posting test');
      }
    }
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO Tests (test_type, user_id, test_link) VALUES (?, ?, ?)',
      [test.test_type, test.user_id, test.test_link]
    );
    if (result) {
      return {message: 'Test posted'};
    } else {
      throw new Error('Error posting test');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error posting test');
  }
};
// put test
const putTest = async (
  test: Omit<Test, 'user_id'>,
  user_id: number,
  test_id: number
): Promise<MessageResponse> => {
  const testUpdate: Pick<Test, 'test_type' | 'test_link'> = {
    test_type: '',
    test_link: '',
  };
  if (test.test_type) {
    testUpdate.test_type = test.test_type;
  }
  if (test.test_link) {
    testUpdate.test_link = test.test_link;
  }
  if (testUpdate.test_type === '' && testUpdate.test_link === '') {
    throw new Error('No fields to update');
  }
  try {
    const sql = promisePool.format(
      'UPDATE Tests SET ? WHERE test_id = ? AND user_id = ?',
      [testUpdate, test_id, user_id]
    );
    console.log(test);
    const [result] = await promisePool.execute<ResultSetHeader>(sql);
    if (result.affectedRows === 0) {
      throw new Error('Test not updated');
    }
    return {message: 'Test updated'};
  } catch (error) {
    console.log(error);
    throw new Error('Error updating test');
  }
};
// delete test
const deleteTest = async (
  test_id: number,
  user_id: number
): Promise<MessageResponse> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM Tests WHERE test_id = ? AND user_id = ?',
      [test_id, user_id]
    );
    console.log(result);
    if (result.affectedRows === 0) {
      throw new Error('Test not deleted');
    }
    return {message: 'Test deleted'};
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting test');
  }
};

export {getTests, getTestsByUser, postTest, putTest, deleteTest};
