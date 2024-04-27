import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {
  Job,
  JobWithSkillsAndKeywords,
  Test,
} from '../../../../hybrid-types/DBTypes';
import {
  addTestToJob,
  deleteJobFromTest,
  deleteTest,
  getAllTests,
  getCandidateTests,
  getJobsByTest,
  getTests,
  getTestsByUser,
  getTestsForJobs,
  postTest,
  putTest,
  takeTest,
} from '../models/testModel';

const handleGetAllTests = async (
  req: Request,
  res: Response<Test[]>,
  next: NextFunction
) => {
  try {
    const tests = await getAllTests();
    if (tests === null) {
      next(new CustomError('Tests not found', 404));
      return;
    }
    res.json(tests);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetGeneralTests = async (
  req: Request,
  res: Response<Test[]>,
  next: NextFunction
) => {
  try {
    const tests = await getTests();
    if (tests === null) {
      next(new CustomError('Tests not found', 404));
      return;
    }
    res.json(tests);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetTestsByUser = async (
  req: Request,
  res: Response<Test[]>,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const tests = await getTestsByUser(user.user_id);
    if (tests === null) {
      next(new CustomError('Tests not found', 404));
      return;
    }
    res.json(tests);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handlePostTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const test = req.body;
    const result = await postTest({...test, user_id: user.user_id});
    if (result.message === 'Test posted') {
      res.json(result);
      return;
    }
    next(new CustomError('Error posting test', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handlePutTest = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const test = req.body;
    const testId = parseInt(req.params.id);
    console.log(user, test);
    const result = await putTest(test, user.user_id, testId);
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Error updating test', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleDeleteTest = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const testId = parseInt(req.params.id);
    console.log(user, testId);
    const result = await deleteTest(testId, user.user_id);
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Error deleting test', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetTestsForJob = async (
  req: Request<{id: string}>,
  res: Response<Test[]>,
  next: NextFunction
) => {
  try {
    const jobId = parseInt(req.params.id);
    const tests = await getTestsForJobs(jobId);
    if (tests === null) {
      next(new CustomError('Tests not found', 404));
      return;
    }
    res.json(tests);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleAddTestToJob = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = parseInt(req.params.id);
    const testId = req.body.test_id;
    console.log(jobId, testId);
    const result = await addTestToJob(jobId, testId);
    if (result.message === 'Test added to job') {
      res.json(result);
      return;
    }
    next(new CustomError('Error adding test to job', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetJobsByTest = async (
  req: Request<{id: string}>,
  res: Response<Job[]>,
  next: NextFunction
) => {
  try {
    const testId = parseInt(req.params.id);
    const jobs = await getJobsByTest(testId);
    if (jobs === null) {
      next(new CustomError('Jobs not found', 404));
      return;
    }
    res.json(jobs);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleDeleteJobFromTest = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const testId = parseInt(req.params.id);
    const jobId = req.body.job_id;
    const result = await deleteJobFromTest(jobId, testId);
    if (result.message === 'Job deleted from test') {
      res.json(result);
      return;
    }
    next(new CustomError('Error deleting job from test', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetCandidatesTests = async (
  req: Request,
  res: Response<Test[]>,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const tests = await getCandidateTests(user.user_id);
    if (tests === null) {
      next(new CustomError('Tests not found', 404));
      return;
    }
    res.json(tests);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleTakeTest = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    const test_id = parseInt(req.params.id);
    const result = await takeTest(test_id, user.user_id);
    if (result.message === 'Test taken') {
      res.json(result);
      return;
    }
    next(new CustomError('Error taking test', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {
  handleGetAllTests,
  handleGetGeneralTests,
  handleGetTestsByUser,
  handlePostTest,
  handlePutTest,
  handleDeleteTest,
  handleGetTestsForJob,
  handleAddTestToJob,
  handleGetJobsByTest,
  handleDeleteJobFromTest,
  handleGetCandidatesTests,
  handleTakeTest,
};
