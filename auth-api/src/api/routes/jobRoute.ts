import express from 'express';
import { authenticate } from '../../middlewares';
import {fetchAllJobs, fetchJobById, fetchJobsByCompany, fetchJobsByField} from '../controllers/jobController';

const jobRoute = express.Router();

jobRoute.get('/', fetchAllJobs);
jobRoute.get('/company', authenticate, fetchJobsByCompany);
jobRoute.get('/:id', fetchJobById);
jobRoute.get('/:field', fetchJobsByField);

export default jobRoute;

