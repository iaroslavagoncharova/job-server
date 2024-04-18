import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import {promisePool} from '../../lib/db';
import {Report} from '@sharedTypes/DBTypes';

const getAllReports = async (user_id: number): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports'
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getUnresolvedReports = async (
  user_id: number
): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE is_resolved = "not_resolved"'
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getResolvedReports = async (
  user_id: number
): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE is_resolved = "resolved"'
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportById = async (
  report_id: number,
  user_id: number
): Promise<Report | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE report_id = ?',
      [report_id]
    );
    return results[0] as Report;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportsByUser = async (user_id: number): Promise<Report[] | null> => {
  try {
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE user_id = ?',
      [user_id]
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportedUsers = async (user_id: number): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE reported_item_type = "User"'
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportedJobs = async (user_id: number): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE reported_item_type = "Job"'
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const sendReport = async (
  user_id: number,
  reported_item_type: string,
  reported_item_id: number,
  report_reason: string
): Promise<ResultSetHeader> => {
  try {
    const [reportCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE user_id = ? AND reported_item_id = ?',
      [user_id, reported_item_id]
    );
    if (reportCheck.length > 0) {
      throw new CustomError('You have already reported this item', 403);
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      'INSERT INTO Reports (user_id, reported_item_type, reported_item_id, report_reason, is_resolved) VALUES (?, ?, ?, ?, "not_resolved")',
      [user_id, reported_item_type, reported_item_id, report_reason]
    );
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const resolveReport = async (
  report_id: number,
  user_id: number
): Promise<ResultSetHeader> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError(
        'You do not have permission to resolve reports',
        403
      );
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      'UPDATE Reports SET is_resolved = "resolved" WHERE report_id = ?',
      [report_id]
    );
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const deleteReport = async (
  report_id: number,
  user_id: number
): Promise<ResultSetHeader> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError(
        'You do not have permission to delete reports',
        403
      );
    }
    const [result] = await promisePool.query<ResultSetHeader>(
      'DELETE FROM Reports WHERE report_id = ?',
      [report_id]
    );
    return result;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export {
  getAllReports,
  getUnresolvedReports,
  getResolvedReports,
  getReportById,
  getReportsByUser,
  getReportedUsers,
  getReportedJobs,
  sendReport,
  resolveReport,
  deleteReport,
};
