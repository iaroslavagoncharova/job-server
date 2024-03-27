import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {JobResponse, MessageResponse} from '@sharedTypes/MessageTypes';
import {validationResult} from 'express-validator';
import {Job, JobWithSkillsAndKeywords} from '@sharedTypes/DBTypes';
import {deleteJob, getAllJobs, getJobByField, getJobById, getJobsByCompany, postJob} from '../models/jobModel';

const fetchAllJobs = async (
  req: Request,
  res: Response<Job[]>,
  next: NextFunction
): Promise<Job[] | void> => {
  try {
    const jobs = await getAllJobs();
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

const fetchJobById = async (
  req: Request,
  res: Response<JobWithSkillsAndKeywords>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const job = await getJobById(+id);
    console.log(job, 'job');
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
    console.log(job, 'job');
    const tokenUser = res.locals.user;
    console.log(tokenUser, 'tokenUser');
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

export {fetchJobsByCompany, fetchJobById, fetchAllJobs, fetchJobsByField, addJob, removeJob};
