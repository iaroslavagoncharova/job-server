import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import {promisePool} from '../../lib/db';
import {JobResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {
  Job,
  JobWithSkillsAndKeywords,
  User,
  UpdateJob,
} from '@sharedTypes/DBTypes';
import {getUserById} from '../controllers/userController';
import {getUser} from './userModel';

const getAllJobs = async (user_id: number): Promise<Job[] | null> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Job[]>(
      // check if a user id is swiper id and job id is swiped id and swipe type is job, and if a user has swiped right or left on a job, then that job should not be shown to the user
      // select job ads, their keywords, skills and get company name aka username from user id
      'SELECT JobAds.*, GROUP_CONCAT(DISTINCT Skills.skill_name) AS skills, GROUP_CONCAT(DISTINCT KeyWords.keyword_name) AS keywords, Users.username FROM JobAds LEFT JOIN JobSkills ON JobAds.job_id = JobSkills.job_id LEFT JOIN Skills ON JobSkills.skill_id = Skills.skill_id LEFT JOIN KeywordsJobs ON JobAds.job_id = KeywordsJobs.job_id LEFT JOIN KeyWords ON KeywordsJobs.keyword_id = KeyWords.keyword_id LEFT JOIN Users ON JobAds.user_id = Users.user_id WHERE JobAds.job_id NOT IN (SELECT Swipes.swiped_id FROM Swipes WHERE Swipes.swiper_id = ? AND Swipes.swipe_type = "job") GROUP BY JobAds.job_id;',
      [user_id]
    );
    if (rows.length === 0) {
      return null;
    }
    if (!rows) {
      return null;
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

const getJobById = async (
  id: number
): Promise<JobWithSkillsAndKeywords | null> => {
  try {
    const [result] = await promisePool.execute<
      RowDataPacket[] & JobWithSkillsAndKeywords[]
    >(
      'SELECT JobAds.*, GROUP_CONCAT(DISTINCT Skills.skill_name) AS skills, GROUP_CONCAT(DISTINCT KeyWords.keyword_name) AS keywords FROM JobAds LEFT JOIN JobSkills ON JobAds.job_id = JobSkills.job_id LEFT JOIN Skills ON JobSkills.skill_id = Skills.skill_id LEFT JOIN KeywordsJobs ON JobAds.job_id = KeywordsJobs.job_id LEFT JOIN KeyWords ON KeywordsJobs.keyword_id = KeyWords.keyword_id WHERE JobAds.job_id = ? GROUP BY JobAds.job_id;',
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

const postJob = async (
  job: JobWithSkillsAndKeywords,
  user_id: number
): Promise<JobResponse> => {
  try {
    const userCheck = await getUser(user_id);
    if (!userCheck) {
      throw new CustomError('User not found', 404);
    }
    if (userCheck.user_type !== 'employer') {
      throw new CustomError('User is not a company', 400);
    }
    console.log(job, userCheck);

    // Insert job details
    const [result] = await promisePool.execute<ResultSetHeader>(
      'INSERT INTO JobAds (job_address, job_title, salary, user_id, job_description, deadline_date, field) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        job.job_address,
        job.job_title,
        job.salary,
        user_id,
        job.job_description,
        job.deadline_date,
        job.field,
      ]
    );

    console.log(result, 'result');

    if (result.affectedRows === 0) {
      throw new CustomError('Job creation failed', 500);
    }

    const insertedJobId = result.insertId;

    // Insert job skills
    const skills = job.skills.split(',').map((skill) => Number(skill.trim()));
    for (const skillId of skills) {
      const [skillsResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO JobSkills (job_id, skill_id) VALUES (?, ?)',
        [insertedJobId, skillId]
      );
      console.log(skillsResult, 'skillsResult');
      if (skillsResult.affectedRows === 0) {
        throw new CustomError('Job skills insertion failed', 500);
      }
    }

    // Insert job keywords
    const keywords = job.keywords.split(',').map((keyword) => keyword.trim());
    console.log(keywords);
    for (const keyword of keywords) {
      const [keywordsResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO KeywordsJobs (job_id, keyword_id) VALUES (?, ?)',
        [insertedJobId, keyword]
      );
      console.log(keywordsResult, 'keywordsResult');
      if (keywordsResult.affectedRows === 0) {
        throw new CustomError('Job keywords insertion failed', 500);
      }
    }

    // Fetch inserted job details
    const insertedJob = await getJobById(insertedJobId);
    console.log(insertedJob, 'insertedJob');
    if (!insertedJob) {
      throw new CustomError('Job not found', 404);
    }

    const response = {
      message: 'Job created',
      job: insertedJob,
    };

    return response;
  } catch (err) {
    throw new CustomError('postJob failed', 500);
  }
};

const putJob = async (
  job_id: number,
  job: UpdateJob,
  user_id: number
): Promise<JobResponse> => {
  try {
    const updateJob: UpdateJob = {};
    if (job.job_address !== undefined) {
      updateJob.job_address = job.job_address;
    }
    if (job.job_title !== undefined) {
      updateJob.job_title = job.job_title;
    }
    if (job.salary !== undefined) {
      updateJob.salary = job.salary;
    }
    if (job.job_description !== undefined) {
      updateJob.job_description = job.job_description;
    }
    if (job.deadline_date !== undefined) {
      updateJob.deadline_date = job.deadline_date;
    }
    if (job.field !== undefined) {
      updateJob.field = job.field;
    }
    console.log(updateJob);
    const sql = promisePool.format(
      'UPDATE JobAds SET ? WHERE job_id = ? AND user_id = ?',
      [updateJob, job_id, user_id]
    );
    console.log(sql);
    const [result] = await promisePool.execute<ResultSetHeader>(sql);

    console.log(result, 'result');

    if (result.affectedRows === 0) {
      throw new CustomError('Job update failed', 500);
    }

    if (job.skills !== null && job.skills !== undefined) {
      // Delete job skills
      await promisePool.execute('DELETE FROM JobSkills WHERE job_id = ?', [
        job_id,
      ]);

      // Insert job skills
      const skills = job.skills.split(',').map((skill) => Number(skill.trim()));
      for (const skillId of skills) {
        const [skillsResult] = await promisePool.execute<ResultSetHeader>(
          'INSERT INTO JobSkills (job_id, skill_id) VALUES (?, ?)',
          [job_id, skillId]
        );
        console.log(skillsResult, 'skillsResult');
        if (skillsResult.affectedRows === 0) {
          throw new CustomError('Job skills insertion failed', 500);
        }
      }
    }
    if (job.keywords !== null && job.keywords !== undefined) {
      // Delete job keywords
      await promisePool.execute('DELETE FROM KeywordsJobs WHERE job_id = ?', [
        job_id,
      ]);

      // Insert job keywords
      const keywords = job.keywords.split(',').map((keyword) => keyword.trim());
      console.log(keywords);
      for (const keyword of keywords) {
        const [keywordsResult] = await promisePool.execute<ResultSetHeader>(
          'INSERT INTO KeywordsJobs (job_id, keyword_id) VALUES (?, ?)',
          [job_id, keyword]
        );
        console.log(keywordsResult, 'keywordsResult');
        if (keywordsResult.affectedRows === 0) {
          throw new CustomError('Job keywords insertion failed', 500);
        }
      }
    }
    const updatedJob = await getJobById(job_id);
    if (!updatedJob) {
      throw new CustomError('Job not found', 404);
    }
    const response = {
      message: 'Job updated',
      job: updatedJob,
    };
    return response;
  } catch (err) {
    throw new CustomError('putJob failed', 500);
  }
};

const deleteJob = async (
  job_id: number,
  user_id: number
): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM JobSkills WHERE job_id = ?', [
      job_id,
    ]);
    await connection.execute('DELETE FROM KeywordsJobs WHERE job_id = ?', [
      job_id,
    ]);
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM JobAds WHERE job_id = ? AND user_id = ?',
      [job_id, user_id]
    );
    if (result.affectedRows === 0) {
      throw new CustomError('Job not found', 404);
    }
    await connection.commit();
    return {message: 'Job deleted'};
  } catch (err) {
    throw new CustomError('deleteJob failed', 500);
  }
};

export {
  getJobsByCompany,
  getJobById,
  getAllJobs,
  getJobByField,
  postJob,
  putJob,
  deleteJob,
};
