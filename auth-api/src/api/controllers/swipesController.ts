import {NextFunction, Response, Request} from 'express';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';
import {Swipe} from '@sharedTypes/DBTypes';
import {deleteSwipe, getRightSwipes, getRightSwipesByUser, getSwipeByUserId, getSwipes, getSwipesByUser, postSwipe} from '../models/swipesModel';
import {MessageResponse, SwipeResponse} from '@sharedTypes/MessageTypes';

const getAllSwipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Swipe[] | void> => {
  try {
    const result = await getSwipes();
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getUserSwipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Swipe[] | void> => {
  try {
    const tokenUser = res.locals.user;
    const result = await getSwipesByUser(tokenUser.user_id);
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSwipe = async (
  req: Request,
  res: Response<Swipe>,
  next: NextFunction
): Promise<Swipe | void> => {
  try {
    const id = req.params.id;
    const result = await getSwipeByUserId(+id);
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

const getSwipesRight = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Swipe[] | void> => {
  try {
    const result = await getRightSwipes();
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next (new CustomError((error as Error).message, 500));
  }
};

const getUserRightSwipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Swipe[] | void> => {
  try {
    const tokenUser = res.locals.user;
    const result = await getRightSwipesByUser(tokenUser.user_id);
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSwipeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Swipe[] | void> => {
  try {
    const id = req.params.id;
    const result = await getSwipeByUserId(+id);
    if (!result) {
      next(new CustomError('No swipes found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const addSwipe = async (
  req: Request,
  res: Response<SwipeResponse>,
  next: NextFunction
): Promise<Swipe | void> => {
  const swipe = req.body;
  const tokenUser = res.locals.user;
  try {
    const result = await postSwipe(tokenUser.user_id, swipe);
    if (!result) {
      next(new CustomError('Swipe not added', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    return next(error);
  }
};

const removeSwipe = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
  const id = req.params.id;
  const result = await deleteSwipe(+id);
  if (!result) {
    next(new CustomError('No swipes found', 404));
    return;
  }
  res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {getAllSwipes, getUserSwipes, getSwipesRight, getUserRightSwipes, getSwipeById, removeSwipe, getSwipe, addSwipe};
