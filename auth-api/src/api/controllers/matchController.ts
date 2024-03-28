import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {
  deleteMatch,
  getMatches,
  getMatchesByUser,
  postMatch,
} from '../models/matchModel';
import {Match} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const getAllMatches = async (
  req: Request,
  res: Response<Match[]>,
  next: NextFunction
): Promise<Match[] | void> => {
  try {
    const matches = await getMatches();
    if (!matches) {
      return next(new CustomError('No matches found', 404));
    }
    res.json(matches);
  } catch (error) {
    return next(error);
  }
};

const getUserMatches = async (
  req: Request<{id: string}>,
  res: Response<Match[]>,
  next: NextFunction
): Promise<Match[] | void> => {
  try {
    const id = req.params.id;
    const matches = await getMatchesByUser(+id);
    if (!matches) {
      return next(new CustomError('No matches found', 404));
    }
    res.json(matches);
  } catch (error) {
    return next(error);
  }
};

const addMatch = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const user1_id = res.locals.user.user_id;
    const user2_id = req.body.user2_id;
    const match = await postMatch(user1_id, user2_id);
    if (!match) {
      return next(new CustomError('Match not created', 500));
    }
    res.json(match);
  } catch (error) {
    return next(error);
  }
};

const removeMatch = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const id = req.params.id;
    const match = await deleteMatch(+id);
    if (!match) {
      return next(new CustomError('Match not found', 404));
    }
    res.json(match);
  } catch (error) {
    return next(error);
  }
};

export {getAllMatches, getUserMatches, addMatch, removeMatch};
