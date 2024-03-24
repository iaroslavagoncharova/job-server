import express from 'express';
import {
  getEducation,
  getExperienceById,
  postEducation,
  removeEducation,
  updateEducation,
} from '../controllers/profileController';
import {authenticate} from '../../middlewares';
import {body} from 'express-validator';
import {profile} from 'console';

const profileRoute = express.Router();

// routes for education
profileRoute.get('/education', authenticate, getEducation);
profileRoute.post(
  '/education',
  body('school').isString().notEmpty().escape().trim(),
  body('degree').isString().notEmpty().escape().trim(),
  body('field').isString().notEmpty().escape().trim(),
  body('graduation').isString().notEmpty().escape().trim(),
  authenticate,
  postEducation
);
profileRoute.put(
  '/education/:education_id',
  body('school').isString().optional().escape().trim(),
  body('degree').isString().optional().escape().trim(),
  body('field').isString().optional().escape().trim(),
  body('graduation').isString().optional().escape().trim(),
  authenticate,
  updateEducation
);
profileRoute.delete('/education/:education_id', authenticate, removeEducation);

// routes for experience
profileRoute.get('/experience', authenticate, getExperienceById);
// router.post('/experience', authenticate, addExperience);
// router.put('/experience', authenticate, updateExperience);
// router.delete('/experience', authenticate, deleteExperience);

export default profileRoute;
