import express from 'express';
import {
  addAttachment,
  addUserSkill,
  getEducation,
  getExperienceById,
  getSkills,
  getSkillsByUser,
  getSkillsByUserId,
  getUserAttachments,
  postEducation,
  postExperience,
  removeAttachment,
  removeEducation,
  removeExperience,
  removeUserSkill,
  updateAttachment,
  updateEducation,
  updateExperience,
  updateUserSkill,
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
profileRoute.post(
  '/experience',
  authenticate,
  postExperience
);
profileRoute
  .route('/experience/:experience_id')
  .put(
    authenticate,
    updateExperience
  )
  .delete(authenticate, removeExperience);

// routes for skills
profileRoute.get('/skills', getSkills);
profileRoute.get('/skills/user', authenticate, getSkillsByUser);
profileRoute.get('/skills/user/:user_id', getSkillsByUserId);
profileRoute.post('/skills/:skill_id', authenticate, addUserSkill);
profileRoute
  .route('/skills/:skill_id')
  .put(authenticate, updateUserSkill)
  .delete(authenticate, removeUserSkill);

//routes for attachments
profileRoute.get('/attachments', authenticate, getUserAttachments);
profileRoute.post('/attachments', authenticate, addAttachment);
profileRoute.put('/attachments/:attachment_id', authenticate, updateAttachment);
profileRoute.delete(
  '/attachments/:attachment_id',
  authenticate,
  removeAttachment
);

export default profileRoute;
