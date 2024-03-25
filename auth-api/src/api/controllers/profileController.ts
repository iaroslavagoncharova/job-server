import {Request, Response, NextFunction} from 'express';
import {Pool} from 'mysql2/promise';
import CustomError from '../../classes/CustomError';
import {
  addEducation,
  addExperience,
  deleteEducation,
  deleteExperience,
  getEducationByUser,
  getExperience,
  putEducation,
  putExperience,
} from '../models/profileModel';
import {EducationInfo, Experience, ExperienceInfo} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';
import {validationResult} from 'express-validator';

const getEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<EducationInfo[] | void> => {
  try {
    const id = res.locals.user.user_id;
    const result = await getEducationByUser(id);
    if (result.length === 0) {
      next(new CustomError('No education found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to get education', 500));
  }
};

const postEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = res.locals.user.user_id;
    const education = req.body;
    const result = await addEducation(id, education);
    if (!result) {
      next(new CustomError('Failed to add education', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Adding education failed', 500));
  }
};

const updateEducation = async (
  req: Request<{education_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    console.log('updateEducation validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const {school, degree, field, graduation} = req.body;
    if (!school && !degree && !field && !graduation) {
      next(new CustomError('No fields to update', 400));
      return;
    }
    const education = {
      school: school || null,
      degree: degree || null,
      field: field || null,
      graduation: graduation || null,
    };
    const education_id = req.params.education_id;
    const user_id = res.locals.user.user_id;
    const result = await putEducation(user_id, +education_id, education);
    if (!result) {
      next(new CustomError('Failed to update education', 500));
      return;
    }
    const response: MessageResponse = {message: 'Education updated'};
    res.json(response);
  } catch (error) {
    next(new CustomError('Updating education failed', 500));
  }
};

const removeEducation = async (
  req: Request<{education_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const education_id = req.params.education_id;
    const user_id = res.locals.user.user_id;
    const result = await deleteEducation(user_id, +education_id);
    if (!result) {
      next(new CustomError('Failed to delete education', 500));
      return;
    }
    const response: MessageResponse = {message: 'Education deleted'};
    res.json(response);
  } catch (error) {
    next(new CustomError('Deleting education failed', 500));
  }
};

const getExperienceById = async (
  req: Request,
  res: Response<Experience[]>,
  next: NextFunction
): Promise<Experience[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const experience = await getExperience(user_id);
    if (experience.length === 0) {
      next(new CustomError('No experience found', 404));
      return;
    }
    res.json(experience);
  } catch (error) {
    next(new CustomError('Getting experience failed', 500));
  }
};

const postExperience = async (
  req: Request<{}, {}, ExperienceInfo>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
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
    const experience = req.body;
    if (
      !experience.job_title ||
      !experience.job_place ||
      !experience.start_date ||
      !experience.end_date
    ) {
      next(new CustomError('Missing required fields', 400));
      return;
    }
    const user_id = res.locals.user.user_id;
    const createdExperience = await addExperience(experience, user_id);
    if (!createdExperience) {
      next(new CustomError('Experience not added', 404));
      return;
    }
    res.json(createdExperience);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const updateExperience = async (
  req: Request<{experience_id: string}>,
  res: Response,
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
    const experience = req.body;
    const user_id = res.locals.user.user_id;
    const experience_id = req.params.experience_id;
    if (!experience) {
      next(new CustomError('No experience to update', 400));
      return;
    }
    const result = await putExperience(user_id, +experience_id, experience);
    if (!result) {
      next(new CustomError('Failed to add experience', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Adding experience failed', 500));
  }
}

const removeExperience = async (
  req: Request<{experience_id: string}>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const experience_id = req.params.experience_id;
    console.log(experience_id, 'experience_id');
    const user_id = res.locals.user.user_id;
    const result = await deleteExperience(user_id, +experience_id);
    if (!result) {
      next(new CustomError('Failed to delete experience', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Deleting experience failed', 500));
  }
};

export {
  postEducation,
  getEducation,
  updateEducation,
  removeEducation,
  getExperienceById,
  updateExperience,
  removeExperience,
  postExperience,
};
