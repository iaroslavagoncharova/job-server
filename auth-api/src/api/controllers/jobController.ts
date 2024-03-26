import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {validationResult} from 'express-validator';
import {Job, JobWithSkillsAndKeywords} from '@sharedTypes/DBTypes';
import {getAllJobs, getJobByField, getJobById, getJobsByCompany} from '../models/jobModel';

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

export {fetchJobsByCompany, fetchJobById, fetchAllJobs, fetchJobsByField};
