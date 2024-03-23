import { Request, Response, NextFunction } from 'express';
import { profileModel } from '../models/profileModel';
import { Pool } from 'mysql2/promise';
import CustomError from '../../classes/CustomError';

export const addEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.user.user_id; // Assuming user ID is stored in res.locals.user
    const educationInfo = req.body;
    await profileModel.addEducation(userId, educationInfo);
    res.status(200).json({ message: 'Education added successfully.' });
  } catch (error) {
    next(new CustomError('Adding education failed', 500));
  }
};

export const updateEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { educationId, educationInfo } = req.body;
    const userId = res.locals.user.user_id;
    await profileModel.updateEducation(userId, educationId, educationInfo);
    res.status(200).json({ message: 'Education updated successfully.' });
  } catch (error) {
    next(new CustomError('Updating education failed', 500));
  }
};

export const deleteEducation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { educationId } = req.body;
    const userId = res.locals.user.user_id;
    await profileModel.deleteEducation(userId, educationId);
    res.status(200).json({ message: 'Education deleted successfully.' });
  } catch (error) {
    next(new CustomError('Deleting education failed', 500));
  }
};

export const addExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = res.locals.user.user_id;
    const experienceInfo = req.body;
    await profileModel.addExperience(userId, experienceInfo);
    res.status(200).json({ message: 'Experience added successfully.' });
  } catch (error) {
    next(new CustomError('Adding experience failed', 500));
  }
};

export const updateExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { experienceId, experienceInfo } = req.body;
    const userId = res.locals.user.user_id;
    await profileModel.updateExperience(userId, experienceId, experienceInfo);
    res.status(200).json({ message: 'Experience updated successfully.' });
  } catch (error) {
    next(new CustomError('Updating experience failed', 500));
  }
};

export const deleteExperience = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { experienceId } = req.body;
    const userId = res.locals.user.user_id;
    await profileModel.deleteExperience(userId, experienceId);
    res.status(200).json({ message: 'Experience deleted successfully.' });
  } catch (error) {
    next(new CustomError('Deleting experience failed', 500));
  }
};
