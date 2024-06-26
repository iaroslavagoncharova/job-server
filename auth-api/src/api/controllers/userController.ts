import {NextFunction, Response, Request} from 'express';
import {
  CandidateProfile,
  TokenUser,
  UnauthorizedUser,
  UpdateUser,
  User,
} from '../../../../hybrid-types/DBTypes';
import {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  putUser,
  getUserAsCandidate,
  getAllCandidates,
  getOneCandidate,
  deleteUserAsAdmin,
  checkEmail,
} from '../models/userModel';
import CustomError from '../../classes/CustomError';
import {validationResult} from 'express-validator';
import {MessageResponse, UserResponse} from '@sharedTypes/MessageTypes';
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response<{exists: boolean}>,
  next: NextFunction
): Promise<{exists: boolean} | void> => {
  try {
    const exists = await checkEmail(req.params.email);
    res.json({exists: exists});
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getAllUsers = async (
  req: Request,
  res: Response<UnauthorizedUser[]>,
  next: NextFunction
): Promise<UnauthorizedUser[] | void> => {
  try {
    const users = await getUsers();
    if (users === null) {
      next(new CustomError('Users not found', 404));
      return;
    }
    res.status(200).json(users);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getUserById = async (
  req: Request<{id: number}>,
  res: Response<UnauthorizedUser>,
  next: NextFunction
): Promise<UnauthorizedUser | void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('getUserById validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await getUser(req.params.id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getCandidateUser = async (
  req: Request<{id: number}>,
  res: Response<CandidateProfile>,
  next: NextFunction
): Promise<CandidateProfile | void> => {
  try {
    const user = await getOneCandidate(req.params.id);
    if (user === null) {
      next(new CustomError('Candidate not found', 404));
      return;
    }
    res.json(user);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getCandidates = async (
  req: Request,
  res: Response<CandidateProfile[]>,
  next: NextFunction
): Promise<CandidateProfile[] | void> => {
  try {
    const user = res.locals.user;
    const users = await getAllCandidates(user.user_id);
    if (users === null) {
      next(new CustomError('Users not found', 404));
      return;
    }
    res.json(users);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const getUserByToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenUser}>,
  next: NextFunction
): Promise<UserResponse | void> => {
  try {
    const tokenUser = res.locals.user;
    const user = await getUser(tokenUser.user_id);
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }
    const response: UserResponse = {
      message: 'token is valid',
      user: user,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const addUser = async (
  req: Request<
    {},
    {},
    Pick<
      User,
      | 'username'
      | 'password'
      | 'email'
      | 'fullname'
      | 'phone'
      | 'user_type'
      | 'address'
      | 'user_level_id'
    >
  >,
  res: Response<UserResponse>,
  next: NextFunction
): Promise<UserResponse | void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('addUser validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, salt);
    const createdUser = await postUser(user);
    if (!createdUser) {
      next(new CustomError('User not created', 400));
      return;
    }
    const response: UserResponse = {
      message: 'User created',
      user: createdUser,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const updateUser = async (
  req: Request<UpdateUser>,
  res: Response<UserResponse>,
  next: NextFunction
): Promise<UserResponse | void> => {
  try {
    const tokenUser = res.locals.user;
    const result = await putUser(tokenUser.user_id, req.body);
    if (!result) {
      next(new CustomError('User not updated', 404));
      return;
    }
    const response = {
      message: 'User updated',
      user: result,
    };
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const removeUser = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const tokenUser = res.locals.user;
    const user = await getUser(tokenUser.user_id);
    if (user === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    const response = await deleteUser(tokenUser.user_id);
    if (response === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const removeUserAsAdmin = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const tokenUser = res.locals.user;
    const response = await deleteUserAsAdmin(+req.params.id, tokenUser.user_id);
    if (response === null) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {
  getAllUsers,
  getUserById,
  getCandidateUser,
  getCandidates,
  addUser,
  getUserByToken,
  removeUser,
  updateUser,
  removeUserAsAdmin,
  checkEmailExists,
};
