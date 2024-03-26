import express from 'express';
import {
  addUserSkill,
  getEducation,
  getExperienceById,
  getSkillsByUser,
  postEducation,
  postExperience,
  removeEducation,
  removeExperience,
  updateEducation,
  updateExperience,
} from '../controllers/profileController';
import {authenticate} from '../../middlewares';
import {body} from 'express-validator';

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
profileRoute.post('/experience',
body('job_title').isString().notEmpty().escape().trim(),
body('job_place').isString().notEmpty().escape().trim(),
body('job_city').isString().optional().escape().trim(),
body('description').isString().optional().escape().trim(),
body('start_date').isString().notEmpty().escape().trim(),
body('end_date').isString().optional().escape().trim(),
authenticate, postExperience);
profileRoute.put('/experience/:experience_id',
body('job_title').isString().optional().escape().trim(),
body('job_place').isString().optional().escape().trim(),
body('job_city').isString().optional().escape().trim(),
body('description').isString().optional().escape().trim(),
body('start_date').isString().optional().escape().trim(),
body('end_date').isString().optional().escape().trim(),
authenticate, updateExperience);
profileRoute.delete('/experience/:experience_id', authenticate, removeExperience);

// routes for skills
profileRoute.get('/skills', authenticate, getSkillsByUser);
profileRoute.post('/skills/:skill_id', authenticate, addUserSkill);

export default profileRoute;
