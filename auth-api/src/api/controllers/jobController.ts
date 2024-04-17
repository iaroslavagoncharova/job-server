import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {JobResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {validationResult} from 'express-validator';
import {Job, JobWithSkillsAndKeywords, JobWithUser, UpdateJob} from '@sharedTypes/DBTypes';
import {
  calculatePercentage,
  deleteJob,
  getAllJobs,
  getFields,
  getJobByField,
  getJobById,
  getJobForApplication,
  getJobsByCompany,
  getKeywords,
  postJob,
  putJob,
} from '../models/jobModel';

const fetchAllJobs = async (
  req: Request,
  res: Response<Job[]>,
  next: NextFunction
): Promise<Job[] | void> => {
  try {
    const tokenUser = res.locals.user;
    const jobs = await getAllJobs(tokenUser.user_id);
    if (!jobs) {
      next(new CustomError('No jobs found', 404));
      return;
    }
    res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

const fetchJobsByCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Job[] | void> => {
  try {
    const tokenUser = res.locals.user;
    const jobs = await getJobsByCompany(tokenUser.user_id);
    if (jobs.length === 0) {
      next(new CustomError('No jobs found', 404));
      return;
    }
    res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

const fetchKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const keywords = await getKeywords();
    if (keywords.length === 0) {
      next(new CustomError('No keywords found', 404));
      return;
    }
    res.json(keywords);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const fetchFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fields = await getFields();
    if (fields.length === 0) {
      next(new CustomError('No fields found', 404));
      return;
    }
    res.json(fields);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const fetchJobById = async (
  req: Request,
  res: Response<JobWithSkillsAndKeywords>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const job = await getJobById(+id);
    if (job === null) {
      next(new CustomError('Job not found', 404));
      return;
    }
    res.json(job);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const fetchJobsByField = async (
  req: Request,
  res: Response<Job[]>,
  next: NextFunction
): Promise<Job[] | void> => {
  try {
    const field = req.params.field;
    const jobs = await getJobByField(field);
    res.json(jobs);
  } catch (error) {
    return next(error);
  }
};

const fetchJobForApplication = async (
  req: Request,
  res: Response<JobWithUser>,
  next: NextFunction
): Promise<JobWithUser[] | void> => {
  try {
    const id = req.params.job_id;
    const job = await getJobForApplication(+id);
    if (job === null) {
      next(new CustomError('Job not found', 404));
      return;
    }
    res.json(job);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
}

const addJob = async (
  req: Request,
  res: Response<JobResponse>,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('userPost validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const job = req.body;
    const tokenUser = res.locals.user;
    const result = await postJob(job, tokenUser.user_id);
    if (!result) {
      next(new CustomError('Job creation failed', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const updateJob = async (
  req: Request,
  res: Response<JobResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const job = req.body;
    const tokenUser = res.locals.user;
    const result = await putJob(+id, job, tokenUser.user_id);
    if (!result) {
      next(new CustomError('Job update failed', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const removeJob = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const tokenUser = res.locals.user;
    const job = await getJobById(+id);
    if (job === null) {
      next(new CustomError('Job not found or already deleted', 404));
      return;
    }
    const result = await deleteJob(+id, tokenUser.user_id);
    if (!result) {
      next(new CustomError('Job deletion failed', 500));
      return;
    }
    res.json({message: 'Job deleted'});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const handleCalculatePercentage = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = res.locals.user.user_id;
    const job_id = req.params.id;
    console.log(user_id, job_id);
    const result = await calculatePercentage(user_id, +job_id);
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Error calculating percentage', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {
  fetchJobsByCompany,
  fetchFields,
  fetchJobById,
  fetchAllJobs,
  fetchJobsByField,
  fetchJobForApplication,
  fetchKeywords,
  addJob,
  removeJob,
  updateJob,
  handleCalculatePercentage,
};
