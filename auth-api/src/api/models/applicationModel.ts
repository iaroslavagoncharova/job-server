import {Application, ApplicationLink} from "@sharedTypes/DBTypes";
import CustomError from "../../classes/CustomError";
import {promisePool} from "../../lib/db";
import {ResultSetHeader} from "mysql2";
import {MessageResponse} from "@sharedTypes/MessageTypes";

// getting all applications of a user
const getApplicationsByUserId = async (userId: number): Promise<Application[]> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader & Application[]>(
       'SELECT * FROM Applications WHERE user_id = ?',
       [userId]
     );
     return result;
  } catch (e) {
    throw new CustomError('Failed to get applications', 500);
  }
};

// getting all sent applications for sent-page
const getSentApplicationsByUserId = async (userId: number) => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader & Application[]>(
       'SELECT * FROM Applications WHERE user_id = ? AND status = "sent"',
       [userId]
     );
     return result;
  } catch (e) {
    throw new CustomError('Failed to get sent applications', 500);
  }
};

// getting all saved job ads aka pre-made applications for saved-page
const getSavedApplicationsByUserId = async (userId: number) => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader & Application[]>(
       'SELECT * FROM Applications WHERE user_id = ? AND status = "saved"',
       [userId]
     );
     return result;
  } catch (e) {
    throw new CustomError('Failed to get saved applications', 500);
  }
};

// getting all application info after clicking it
const getApplicationById = async (applicationId: number): Promise<Application | null> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader & Application[]>(
       'SELECT * FROM Applications WHERE application_id = ?',
       [applicationId]
     );
     return result[0];
  } catch (e) {
    throw new CustomError('Failed to get application', 500);
  }
};

// creating an application automatically after a right swipe
const postApplication = async (
  user_id: number,
  job_id: number): Promise<Application | null> => {
    try {
      const result = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO Applications (user_id, job_id, status) VALUES (?, ?, "saved")',
        [user_id, job_id]
      );
      const [rows] = await promisePool.execute<ResultSetHeader & Application[]>(
        'SELECT * FROM Applications WHERE application_id = ?',
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

// updating application text and links
const putApplication = async (
  userId: number,
  applicationId: number,
  applicationText?: string,
  applicationLinks?: ApplicationLink[]) => {
    try {
      if (!applicationText && !applicationLinks) {
        throw new CustomError('No data to update', 400);
      }
      if (applicationText) {
        const sql = promisePool.format(
          'UPDATE Applications SET ? WHERE application_id = ? AND user_id = ?',
          [{application_text: applicationText}, applicationId, userId]);
        const [result] = await promisePool.execute<ResultSetHeader>(sql);
        if (result.affectedRows === 0) {
          return null;
        }
      }
      if (applicationLinks) {
        for (const link of applicationLinks) {
          const sql = promisePool.format(
            'INSERT INTO ApplicationLinks (application_id, link) VALUES (?, ?)',
            [applicationId, link.link]
          );
          const [result] = await promisePool.execute<ResultSetHeader>(sql);
          if (result.affectedRows === 0) {
            throw new CustomError('Failed to add application link', 500);
          }
        }
      }
      return {message: 'Application updated'};
    } catch (e) {
      throw new Error((e as Error).message);
    }
};

// deleting application before it's sent
const deleteApplication = async (
  userId: number,
  applicationId: number): Promise<MessageResponse> => {
    try {
      const sql = promisePool.format(
        'DELETE FROM Applications WHERE application_id = ? AND user_id = ? AND status = "saved"',
        [applicationId, userId]
      );
      const result = await promisePool.execute<ResultSetHeader>(sql);
      if (!result) {
        throw new CustomError('Failed to delete application', 500);
      }
      return {message: 'Application deleted'};
    } catch (e) {
      throw new Error((e as Error).message);
    }
};

// sending application by changing its status to sent
const sendApplication = async (
  userId: number,
  applicationId: number): Promise<MessageResponse> => {
    try {
      const sql = promisePool.format(
        'UPDATE Applications SET status = "sent" WHERE application_id = ? AND user_id = ?',
        [applicationId, userId]
      );
      const result = await promisePool.execute<ResultSetHeader>(sql);
      if (result[0].affectedRows === 0) {
        return {message: 'An error occurred while sending application'};
      }
      return {message: 'Application sent'};
    } catch (e) {
      throw new Error((e as Error).message);
    }
};

// getting all sent applications by job id for sent-page
const getApplicationsByJob = async (jobId: number): Promise<Application[]> => {
  try {
    const [result] = await promisePool.execute<ResultSetHeader & Application[]>(
      'SELECT * FROM Applications WHERE job_id = ? AND status = "sent"',
      [jobId]
    );
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  };
};

export {
  getApplicationsByUserId,
  getSentApplicationsByUserId,
  getSavedApplicationsByUserId,
  getApplicationById,
  postApplication,
  putApplication,
  deleteApplication,
  sendApplication,
  getApplicationsByJob
};
