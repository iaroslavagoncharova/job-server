import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {
  addEducation,
  addExperience,
  deleteAttachment,
  deleteEducation,
  deleteExperience,
  deleteUserSkill,
  getAllSkills,
  getAttachment,
  getAttachments,
  getEducationByUser,
  getExperience,
  getUserSkills,
  postAttachment,
  postUserSkill,
  putAttachment,
  putEducation,
  putExperience,
  putUserSkill,
} from '../models/profileModel';
import {
  Attachment,
  AttachmentInfo,
  Education,
  EducationInfo,
  Experience,
  ExperienceInfo,
  Skill,
  TokenContent,
  UpdateAttachment,
} from '@sharedTypes/DBTypes';
import {MessageResponse, MediaResponse} from '@sharedTypes/MessageTypes';
import {validationResult} from 'express-validator';

const getEducation = async (
  req: Request<{user_id: string}>,
  res: Response<EducationInfo[]>,
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
  req: Request<{}, {}, Omit<Education, 'education_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
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
    next(new CustomError((error as Error).message, 500));
  }
};

const updateEducation = async (
  req: Request<{education_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
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
    const result = await putEducation(+education_id, user_id, education);
    if (!result) {
      next(new CustomError('Failed to update education', 500));
      return;
    }
    const response: MessageResponse = {message: 'Education updated'};
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
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
  req: Request<{experience_id: string}>,
  res: Response<Experience[]>,
  next: NextFunction
): Promise<Experience[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const experience = await getExperience(user_id);
    if (!experience) {
      next(new CustomError('No experience found', 404));
      return;
    }
    res.json(experience);
  } catch (error) {
    next(new CustomError('Getting experience failed', 500));
  }
};

const postExperience = async (
  req: Request<{}, {}, Omit<Experience, 'experience_id'>>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const experience = req.body;
    if (
      !experience.job_title ||
      !experience.job_place ||
      !experience.start_date
    ) {
      next(new CustomError('Missing required fields', 400));
      return;
    }
    const user_id = res.locals.user.user_id;
    const createdExperience = await addExperience(experience, user_id);
    if (!createdExperience) {
      next(new CustomError('Experience not added', 500));
      return;
    }
    res.json(createdExperience);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const updateExperience = async (
  req: Request<{experience_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const {job_title, job_place, job_city, description, start_date, end_date} =
      req.body;
    // if all fields are empty, return error
    if (
      !job_title &&
      !job_place &&
      !job_city &&
      !description &&
      !start_date &&
      !end_date
    ) {
      next(new CustomError('No fields to update', 400));
      return;
    }
    const experience: ExperienceInfo = {
      job_title: job_title || null,
      job_place: job_place || null,
      job_city: job_city || null,
      description: description || null,
      start_date: start_date || null,
      end_date: end_date || null,
    };
    const user_id = res.locals.user.user_id;
    const experience_id = req.params.experience_id;
    if (!experience) {
      next(new CustomError('No experience to update', 400));
      return;
    }
    const result = await putExperience(user_id, +experience_id, experience);
    if (!result) {
      next(new CustomError('Failed to update experience', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const removeExperience = async (
  req: Request<{experience_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const experience_id = req.params.experience_id;
    const user_id = res.locals.user.user_id;
    const result = await deleteExperience(user_id, +experience_id);
    if (!result) {
      next(new CustomError('Failed to delete experience', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getSkills = async (
  req: Request<{}, {}, Skill[]>,
  res: Response<Skill[]>,
  next: NextFunction
): Promise<Skill[] | void> => {
  try {
    const result = await getAllSkills();
    if (result.length === 0) {
      next(new CustomError('No skills found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to get skills', 500));
  }
};

const getSkillsByUserId = async (
  req: Request<{user_id: string}>,
  res: Response<Skill[]>,
  next: NextFunction
): Promise<Skill[] | void> => {
  try {
    const id = req.params.user_id;
    const result = await getUserSkills(+id);
    if (result.length === 0) {
      next(new CustomError('No skills found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to get skills', 500));
  }
};

const getSkillsByUser = async (
  req: Request<{user_id: string}>,
  res: Response<Skill[]>,
  next: NextFunction
): Promise<Skill[] | void> => {
  try {
    const id = res.locals.user.user_id;
    const result = await getUserSkills(id);
    if (result.length === 0) {
      next(new CustomError('No skills found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to get skills', 500));
  }
};

const addUserSkill = async (
  req: Request<{skill_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const id = res.locals.user.user_id;
    const skill_id = req.params.skill_id;
    const result = await postUserSkill(id, +skill_id);
    if (!result) {
      next(new CustomError('Skill not added or already exists', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to add skill', 500));
  }
};

const updateUserSkill = async (
  req: Request<{skill_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const id = res.locals.user.user_id;
    const skill_id = req.params.skill_id;
    const new_skill_id = req.body.skill_id;
    const result = await putUserSkill(id, +skill_id, new_skill_id);
    if (!result) {
      next(new CustomError('Failed to update skill', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const removeUserSkill = async (
  req: Request<{skill_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const id = res.locals.user.user_id;
    const skill_id = req.params.skill_id;
    const result = await deleteUserSkill(id, +skill_id);
    if (!result) {
      next(new CustomError('Failed to remove skill', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getUserAttachments = async (
  req: Request<{user_id: string}>,
  res: Response<Attachment[]>,
  next: NextFunction
): Promise<Attachment[] | void> => {
  try {
    const id = res.locals.user.user_id;
    const result = await getAttachments(id);
    if (result.length === 0) {
      next(new CustomError('No attachments found', 404));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to get attachments', 500));
  }
};

const getAttachmentById = async (
  req: Request<{attachment_id: string}>,
  res: Response<Attachment>,
  next: NextFunction
): Promise<Attachment | void> => {
  try {
    const userId = res.locals.user.user_id;
    const attachmentId = parseInt(req.params.attachment_id);
    const result = await getAttachment(attachmentId, userId);
    if (!result) {
      next(new CustomError('No attachments found', 404));
      return;
    }
    res.json(result);
  } catch (e) {
    next(new CustomError('Failed to get attachment', 500));
  }
};

const addAttachment = async (
  req: Request<{}, {}, AttachmentInfo>,
  res: Response<MediaResponse, {user: TokenContent}>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const userId = res.locals.user.user_id;
    const result = await postAttachment(req.body, userId);
    if (result) {
      res.json({message: 'Media created', media: result});
      return;
    }
    const error = new CustomError('Attachment not created', 500);
    next(error);
  } catch (error) {
    next(new CustomError('Failed to add attachment', 500));
  }
};

const updateAttachment = async (
  req: Request<{attachment_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    console.log('updating attachment');
    const attachment_id = req.params.attachment_id;
    const user_id = res.locals.user.user_id;
    const attachment = req.body;
    console.log(attachment);
    const result = await putAttachment(user_id, +attachment_id, attachment);
    if (!result || result.message === 'Nothing to update') {
      next(new CustomError('Nothing to update', 400));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to update attachment', 500));
  }
};

const removeAttachment = async (
  req: Request<{attachment_id: string}>,
  res: Response<MessageResponse, {user: TokenContent; token: string}>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const attachment_id = req.params.attachment_id;
    const user_id = res.locals.user.user_id;
    const token = res.locals.token;

    const result = await deleteAttachment(user_id, +attachment_id, token);
    if (!result) {
      next(new CustomError('Failed to delete attachment', 500));
      return;
    }
    res.json(result);
  } catch (error) {
    next(new CustomError('Failed to delete attachment', 500));
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
  getSkills,
  getSkillsByUser,
  getSkillsByUserId,
  addUserSkill,
  updateUserSkill,
  removeUserSkill,
  getUserAttachments,
  getAttachmentById,
  addAttachment,
  updateAttachment,
  removeAttachment,
};
