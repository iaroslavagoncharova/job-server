import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import {promisePool} from '../../lib/db';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {Job, JobWithSkillsAndKeywords} from '@sharedTypes/DBTypes';

const getAllJobs = async (): Promise<Job[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Job[]>(
      'SELECT * FROM JobAds'
    );
    if (rows.length === 0) {
      throw new CustomError('No jobs found', 404);
    }
    return rows;
  } catch (err) {
    throw new CustomError('getAllJobs failed', 500);
  }
};

const getJobsByCompany = async (id: number): Promise<Job[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Job[]>(
      'SELECT * FROM JobAds WHERE user_id = ?',
      [id]
    );
    return rows;
  } catch (err) {
    throw new CustomError('getJobsByCompany failed', 500);
  }
};

const getJobById = async (id: number): Promise<JobWithSkillsAndKeywords | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & JobWithSkillsAndKeywords[]>(
      // getting job skills and keywords for the job from jobskills and jobkeywords tables where job_id = id
      'SELECT JobAds.*, GROUP_CONCAT(Skills.skill_name) AS skills, GROUP_CONCAT(KeyWords.keyword_name) AS keywords FROM JobAds LEFT JOIN JobSkills ON JobAds.job_id = JobSkills.job_id LEFT JOIN Skills ON JobSkills.skill_id = Skills.skill_id LEFT JOIN KeywordsJobs ON JobAds.job_id = KeywordsJobs.job_id LEFT JOIN KeyWords ON KeywordsJobs.keyword_id = KeyWords.keyword_id WHERE JobAds.job_id = ? GROUP BY JobAds.job_id;',
      [id]
    );
    if (result.length === 0) {
      return null;
    }
    return result[0];
  } catch (err) {
    throw new Error((err as Error).message);
  }
};

const getJobByField = async (field: string): Promise<Job[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Job[]>(
      'SELECT * FROM JobAds WHERE field = ?',
      [field]
    );
    if (rows.length === 0) {
      throw new CustomError('No jobs found', 404);
    }
    return rows;
  } catch (err) {
    throw new CustomError('getJobByField failed', 500);
  }
};

export {getJobsByCompany, getJobById, getAllJobs, getJobByField};
