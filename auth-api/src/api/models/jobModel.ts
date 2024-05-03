import {ResultSetHeader, RowDataPacket} from 'mysql2';
import CustomError from '../../classes/CustomError';
import {promisePool} from '../../lib/db';
import {JobResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {
  Job,
  JobWithSkillsAndKeywords,
  User,
  UpdateJob,
  JobWithUser,
  Keyword,
  Test,
  UserTest,
  JobSkill,
  UserSkill,
  Field,
} from '@sharedTypes/DBTypes';
import {getUserById} from '../controllers/userController';
import {getUser} from './userModel';
import {
  getCountUserTestsOutOfJobTests,
  getJobTestsCount,
  getTestsForJobs,
} from './testModel';
import {getSkillsByUserId} from '../controllers/profileController';
import {getUserSkills} from './profileModel';

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

const getJobsByCompany = async (
  id: number
): Promise<JobWithSkillsAndKeywords[]> => {
  try {
    // select job ads, their keywords, skills and get company name aka username from user id
    const [jobs] = await promisePool.execute<
      RowDataPacket[] & JobWithSkillsAndKeywords[]
    >(
      'SELECT JobAds.*, GROUP_CONCAT(DISTINCT Skills.skill_name) AS skills, GROUP_CONCAT(DISTINCT KeyWords.keyword_name) AS keywords FROM JobAds LEFT JOIN JobSkills ON JobAds.job_id = JobSkills.job_id LEFT JOIN Skills ON JobSkills.skill_id = Skills.skill_id LEFT JOIN KeywordsJobs ON JobAds.job_id = KeywordsJobs.job_id LEFT JOIN KeyWords ON KeywordsJobs.keyword_id = KeyWords.keyword_id WHERE JobAds.user_id = ? GROUP BY JobAds.job_id;',
      [id]
    );
    console.log(jobs, 'jobs');
    if (!jobs) {
      throw new CustomError('No jobs found', 404);
    }
    return jobs;
  } catch (err) {
    throw new CustomError('getJobsByCompany failed', 500);
  }
};

const getFields = async (): Promise<Field[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Field[]>(
      'SELECT * FROM Fields'
    );
    console.log(rows, 'rows');
    return rows;
  } catch (err) {
    throw new CustomError('getFields failed', 500);
  }
};

const getJobForApplication = async (
  job_id: number,
  user_id: number
): Promise<JobWithUser | null> => {
  try {
    const [result] = await promisePool.execute<RowDataPacket[] & JobWithUser[]>(
      'SELECT JobAds.*, Users.username FROM JobAds LEFT JOIN Users ON JobAds.user_id = Users.user_id WHERE JobAds.job_id = ?;',
      [job_id]
    );
    // select user tests for the job
    const userTests = await getCountUserTestsOutOfJobTests(user_id, job_id);
    console.log(userTests, 'userTests');
    const jobTests = await getJobTestsCount(job_id);
    console.log(jobTests, 'jobTests');
    const job = result[0];
    console.log(job, 'job');
    if (!job) {
      return null;
    }
    const percentage = await calculatePercentage(user_id, job_id);
    console.log(percentage, 'percentage');
    const jobResult: JobWithUser = {
      ...job,
      userTestsCount: userTests,
      jobTestsCount: jobTests,
      percentage,
    };
    console.log(jobResult, 'jobResult');
    return jobResult;
    // return result[0];
  } catch (err) {
    throw new Error((err as Error).message);
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
      if (skillsResult.affectedRows === 0) {
        throw new CustomError('Job skills insertion failed', 500);
      }
    }

    // Insert job keywords
    const keywords = job.keywords.split(',').map((keyword) => keyword.trim());
    for (const keyword of keywords) {
      const [keywordsResult] = await promisePool.execute<ResultSetHeader>(
        'INSERT INTO KeywordsJobs (job_id, keyword_id) VALUES (?, ?)',
        [insertedJobId, keyword]
      );
      if (keywordsResult.affectedRows === 0) {
        throw new CustomError('Job keywords insertion failed', 500);
      }
    }

    // Fetch inserted job details
    const insertedJob = await getJobById(insertedJobId);
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

const getKeywords = async (): Promise<Keyword[]> => {
  try {
    const [rows] = await promisePool.execute<RowDataPacket[] & Keyword[]>(
      'SELECT * FROM KeyWords'
    );
    return rows;
  } catch (err) {
    throw new CustomError('getKeywords failed', 500);
  }
};

const putJob = async (
  job_id: number,
  job: UpdateJob,
  user_id: number
): Promise<JobResponse> => {
  try {
    const updateJob: UpdateJob = {};
    if (
      job.job_address !== undefined &&
      job.job_address !== null &&
      job.job_address !== ''
    ) {
      updateJob.job_address = job.job_address;
    }
    if (
      job.job_title !== undefined &&
      job.job_title !== null &&
      job.job_title !== ''
    ) {
      updateJob.job_title = job.job_title;
    }
    if (job.salary !== undefined && job.salary !== null && job.salary !== '') {
      updateJob.salary = job.salary;
    }
    if (
      job.job_description !== undefined &&
      job.job_description !== null &&
      job.job_description !== ''
    ) {
      updateJob.job_description = job.job_description;
    }
    if (
      job.deadline_date !== undefined &&
      job.deadline_date !== null &&
      job.deadline_date !== ''
    ) {
      updateJob.deadline_date = job.deadline_date;
    }
    if (job.field !== undefined && job.field !== null && job.field !== '') {
      updateJob.field = job.field;
    }

    if (job.skills !== null && job.skills !== undefined && job.skills !== '') {
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
        if (skillsResult.affectedRows === 0) {
          throw new CustomError('Job skills insertion failed', 500);
        }
      }
    }
    if (
      job.keywords !== null &&
      job.keywords !== undefined &&
      job.keywords !== ''
    ) {
      // Delete job keywords
      await promisePool.execute('DELETE FROM KeywordsJobs WHERE job_id = ?', [
        job_id,
      ]);

      // Insert job keywords
      const keywords = job.keywords.split(',').map((keyword) => keyword.trim());
      for (const keyword of keywords) {
        const [keywordsResult] = await promisePool.execute<ResultSetHeader>(
          'INSERT INTO KeywordsJobs (job_id, keyword_id) VALUES (?, ?)',
          [job_id, keyword]
        );
        if (keywordsResult.affectedRows === 0) {
          throw new CustomError('Job keywords insertion failed', 500);
        }
      }
    }
    // if there is nothing to update after keywords and skills, update the job details
    if (Object.keys(updateJob).length === 0) {
      const updatedJob = await getJobById(job_id);
      if (!updatedJob) {
        throw new CustomError('Job not found', 404);
      }
      const response = {
        message: 'Job updated',
        job: updatedJob,
      };
      return response;
    }
    const sql = promisePool.format(
      'UPDATE JobAds SET ? WHERE job_id = ? AND user_id = ?',
      [updateJob, job_id, user_id]
    );
    const [result] = await promisePool.execute<ResultSetHeader>(sql);

    if (result.affectedRows === 0) {
      throw new CustomError('Job update failed', 500);
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
    // delete application links where the application_id is in the applications that have the job_id
    await connection.execute(
      'DELETE FROM ApplicationLinks WHERE application_id IN (SELECT application_id FROM Applications WHERE job_id = ?)',
      [job_id]
    );
    // delete applications where the job_id is the job_id
    await connection.execute('DELETE FROM Applications WHERE job_id = ?', [
      job_id,
    ]);
    // delete job tests where the job_id is the job_id
    await connection.execute('DELETE FROM JobTests WHERE job_id = ?', [job_id]);
    // delete from reports where the reported item id is the job_id and the reported item type is job
    await connection.execute(
      'DELETE FROM Reports WHERE reported_item_id = ? AND reported_item_type = "Job"',
      [job_id]
    );
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

const deleteJobAsAdmin = async (
  job_id: number,
  user_id: number
): Promise<MessageResponse> => {
  try {
    const [adminCheck] = await promisePool.execute<RowDataPacket[]>(
      'SELECT * FROM Users WHERE user_id = ? AND user_level_id = "3"',
      [user_id]
    );
    if (adminCheck.length === 0) {
      throw new CustomError('You do not have permission to delete jobs', 403);
    }
    const [employerId] = await promisePool.execute<RowDataPacket[]>(
      'SELECT user_id FROM JobAds WHERE job_id = ?',
      [job_id]
    );
    if (employerId.length === 0) {
      throw new CustomError('Job not found', 404);
    }
    const result = await deleteJob(job_id, employerId[0].user_id);
    if (!result) {
      throw new CustomError('Job not found', 404);
    }
    return {message: 'Job deleted'};
  } catch (err) {
    throw new CustomError('deleteJobAsAdmin failed', 500);
  }
};
// calculate a compatibility percentage based on the skills required for a job, skills that a candidate has, the amount of tests needed and the amount the candidate has taken
const calculatePercentage = async (user_id: number, job_id: number) => {
  // Get all tests for job
  const totalTests = await getTestsForJobs(job_id);
  if (!totalTests) {
    throw new CustomError('No tests found', 404);
  }
  console.log(totalTests, 'totalTests');
  const totalTestIds = totalTests.map((test) => test.test_id);
  console.log(totalTestIds, 'totalTestIds');
  const totalTestIdPlaceholders = totalTestIds.map((id) => id).join(', ');
  console.log(totalTestIdPlaceholders, 'totalTestIdPlaceholders');
  // select a count of all tests that a user has taken that are in the tests required for the job
  const testsTaken = await promisePool.execute<RowDataPacket[] & UserTest[]>(
    `SELECT * FROM UserTests WHERE user_id = ? AND test_id IN (?)`,
    [user_id, totalTestIdPlaceholders]
  );
  console.log(user_id, 'user_id');
  console.log(testsTaken, 'testsTaken');
  const takenTestsLength = testsTaken[0].length;
  console.log(takenTestsLength, 'takenTestsLength');
  // Get all required skills for job
  const [jobSkills] = await promisePool.execute<RowDataPacket[] & JobSkill[]>(
    'SELECT * FROM JobSkills WHERE job_id = ?',
    [job_id]
  );
  console.log(jobSkills, 'jobSkills');
  const totalSkillsIds = jobSkills.map((skill) => skill.skill_id);
  console.log(totalSkillsIds, 'totalSkillsIds');
  const totalSkillsPlaceholders = totalSkillsIds.map((id) => id).join(', ');
  console.log(totalSkillsPlaceholders, 'totalSkillsPlaceholders');
  // Get all skills that a user has
  const userSkills = await promisePool.execute<RowDataPacket[] & UserSkill[]>(
    `SELECT * FROM UserSkills WHERE user_id = ? AND skill_id IN (?)`,
    [user_id, totalSkillsPlaceholders]
  );
  console.log(userSkills, 'userSkills');
  const totalTestsLength = totalTests.length;
  console.log(totalTestsLength, 'totalTestsLength');
  const testParticipationPercentage =
    (takenTestsLength / totalTestsLength) * 100;
  console.log(testParticipationPercentage, 'testParticipationPercentage');
  // check that the user has skill ids that are in the job skill ids
  const userSkillIds = userSkills[0].map((skill) => skill.skill_id);
  console.log(userSkillIds, 'userSkillIds');
  const skillMatch = userSkillIds.filter((id) => totalSkillsIds.includes(id));
  console.log(skillMatch, 'skillMatch');
  const skillMatchPercentage =
    (skillMatch.length / totalSkillsIds.length) * 100;
  console.log(skillMatchPercentage, 'skillMatchPercentage');
  const skillMatchWeight = 0.7;
  const testParticipationWeight = 0.3;
  const percentage =
    skillMatchPercentage * skillMatchWeight +
    testParticipationPercentage * testParticipationWeight;
  console.log(percentage, 'percentage');

  return percentage;
};

export {
  getJobsByCompany,
  getFields,
  getJobById,
  getJobForApplication,
  getKeywords,
  getAllJobs,
  getJobByField,
  postJob,
  putJob,
  deleteJob,
  deleteJobAsAdmin,
  calculatePercentage,
};
