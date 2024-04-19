import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import {promisePool} from '../../lib/db';
import {Report, ReportedJob, ReportedUser, User} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

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

const getReportsByUser = async (user_id: number, admin_id: number): Promise<Report[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [admin_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE user_id = ?',
      [user_id]
    );
    return results as Report[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportedUsers = async (
  user_id: number
): Promise<ReportedUser[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE reported_item_type = "User" AND is_resolved = "not_resolved"'
    );
    if (results.length === 0) {
      return null;
    }
    // Get the user_id of each reported user
    const userIds = results.map((report) => report.reported_item_id);
    // Get the user data for each reported user except the password, also get info about what a user was reported for and by whom
    const [users] = await promisePool.query<RowDataPacket[]>(
      'SELECT Users.user_id, Users.username, Users.fullname, Users.email, Users.phone, Users.about_me, Users.status, Users.link, Users.field, Users.address, Users.user_type, Reports.report_reason FROM Users JOIN  Reports ON Users.user_id = Reports.reported_item_id WHERE Reports.reported_item_type = "User" AND Users.user_id IN (?)',
      [userIds]
    );
    return users as ReportedUser[];
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

const getReportedJobs = async (user_id: number): Promise<ReportedJob[] | null> => {
  try {
    const [adminCheck] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to view reports', 403);
    }
    const [results] = await promisePool.query<RowDataPacket[]>(
      'SELECT * FROM Reports WHERE reported_item_type = "Job" AND is_resolved = "not_resolved"'
    );
    if (results.length === 0) {
      return null;
    }
    // Get the job_id of each reported job
    const jobIds = results.map((report) => report.reported_item_id);
    // Get the job data for each reported job, also get info about what a job was reported for and by whom
    const [jobs] = await promisePool.query<RowDataPacket[]>(
      'SELECT JobAds.job_id, JobAds.job_title, JobAds.job_description, JobAds.job_address, JobAds.salary, JobAds.user_id, JobAds.deadline_date, JobAds.field, Reports.report_reason FROM JobAds JOIN Reports ON JobAds.job_id = Reports.reported_item_id WHERE Reports.reported_item_type = "Job" AND JobAds.job_id IN (?)',
      [jobIds]
    );
    if (jobs.length === 0) {
      return null;
    }
    return jobs as ReportedJob[];
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
): Promise<MessageResponse> => {
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
    if (result.affectedRows === 0) {
      throw new CustomError('Report not found', 404);
    }
    return {message: 'Report resolved'};
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
