import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {Job, Test} from '../../../../hybrid-types/DBTypes';
import {MessageResponse, TestResponse} from '@sharedTypes/MessageTypes';

// get all existing tests
const getAllTests = async (): Promise<Test[] | null> => {
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

// get tests by jobmein
const getTests = async (): Promise<Test[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM Tests WHERE user_id IS NULL'
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

// get candidate tests
const getCandidateTests = async (userId: number): Promise<Test[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM UserTests WHERE user_id = ?',
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
): Promise<TestResponse> => {
  const testUpdate: Partial<Test> = {};

  if (test.test_type !== '') {
    testUpdate.test_type = test.test_type;
  }
  if (test.test_link !== '') {
    testUpdate.test_link = test.test_link;
  }

  if (Object.keys(testUpdate).length === 0) {
    throw new Error('No fields to update');
  }

  try {
    const sql = promisePool.format(
      'UPDATE Tests SET ? WHERE test_id = ? AND user_id = ?',
      [testUpdate, test_id, user_id]
    );
    const [result] = await promisePool.execute<ResultSetHeader>(sql);
    if (result.affectedRows === 0) {
      throw new Error('Test not updated');
    }
    const [newTest] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM Tests WHERE test_id = ?',
      [test_id]
    );
    return {message: 'Test updated', test: newTest[0]};
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
  const connection = await promisePool.getConnection();
  try {
    // deleting from jobtests first
    await connection.beginTransaction();
    const [jobresult] = await connection.execute(
      'DELETE FROM JobTests WHERE test_id = ?',
      [test_id]
    );
    console.log(jobresult);
    const [userresult] = await connection.execute(
      'DELETE FROM UserTests WHERE test_id = ?',
      [test_id]
    );
    console.log(userresult);
    console.log(user_id);
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Tests WHERE test_id = ? AND user_id = ?',
      [test_id, user_id]
    );
    console.log(result);
    if (result.affectedRows === 0) {
      throw new Error('Test not deleted');
    }
    await connection.commit();
    return {message: 'Test deleted'};
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting test');
  }
};

// get tests for jobs

const getTestsForJobs = async (job_id: number): Promise<Test[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Test[]>(
      'SELECT * FROM JobTests WHERE job_id = ?',
      [job_id]
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

// add test to a job
const addTestToJob = async (
  job_id: number,
  test_id: number
): Promise<MessageResponse> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO JobTests (job_id, test_id) VALUES (?, ?)',
      [job_id, test_id]
    );
    if (result) {
      return {message: 'Test added to job'};
    } else {
      throw new Error('Error adding test to job');
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error adding test to job');
  }
};

const getJobsByTest = async (test_id: number): Promise<Job[] | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & Job[]>(
      'SELECT * FROM JobTests WHERE test_id = ?',
      [test_id]
    );
    if (result.length === 0) {
      return null;
    }

    const jobs: Job[] = [];

    for (const job of result) {
      const [jobResult] = await promisePool.execute<RowDataPacket[] & Job[]>(
        'SELECT * FROM JobAds WHERE job_id = ?',
        [job.job_id]
      );

      if (jobResult.length > 0) {
        jobs.push(jobResult[0]);
      }
    }
    console.log(jobs);

    return jobs;
  } catch (error) {
    console.log(error);
    throw new Error('Error getting jobs');
  }
};

const deleteJobFromTest = async (
  job_id: number,
  test_id: number
): Promise<MessageResponse> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader>(
      'DELETE FROM JobTests WHERE job_id = ? AND test_id = ?',
      [job_id, test_id]
    );
    if (result.affectedRows === 0) {
      throw new Error('Job not deleted from test');
    }
    return {message: 'Job deleted from test'};
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting job from test');
  }
};

// function calculateCompatibility(candidateSkills, requiredSkills, testsTaken, totalTests) {
//   // Calculate skill match percentage
//   const skillMatchPercentage = (candidateSkills.filter(skill => requiredSkills.includes(skill)).length / requiredSkills.length) * 100;

//   // Calculate test participation percentage
//   const testParticipationPercentage = (testsTaken / totalTests) * 100;

//   // Define weights for each percentage
//   const skillMatchWeight = 0.7;
//   const testParticipationWeight = 0.3;

//   // Combine percentages
//   const compatibilityPercentage = (skillMatchPercentage * skillMatchWeight) + (testParticipationPercentage * testParticipationWeight);

//   return compatibilityPercentage;
// }
export {
  getTests,
  getTestsByUser,
  getAllTests,
  postTest,
  putTest,
  deleteTest,
  getTestsForJobs,
  addTestToJob,
  getJobsByTest,
  deleteJobFromTest,
};
