import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {Test} from '../../../../hybrid-types/DBTypes';
import {deleteTest, getTests, getTestsByUser, postTest, putTest} from '../models/testModel';

const handleGetTests = async (
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
    next(new CustomError('Error posting test', 500));
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
export {handleGetTests, handleGetTestsByUser, handlePostTest, handlePutTest, handleDeleteTest};
