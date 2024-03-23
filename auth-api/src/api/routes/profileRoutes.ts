import express from 'express';
import {
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience
} from '../controllers/profileController'; // Adjust the path as necessary
import { authenticate } from '../../middlewares';

const router = express.Router();

// Routes for managing education
router.post('/education', authenticate, addEducation);
router.put('/education', authenticate, updateEducation);
router.delete('/education', authenticate, deleteEducation);

// Routes for managing experience
router.post('/experience', authenticate, addExperience);
router.put('/experience', authenticate, updateExperience);
router.delete('/experience', authenticate, deleteExperience);

export default router;
