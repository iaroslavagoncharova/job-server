import express from 'express';
import { authenticate } from '../../middlewares';
import {addJob, fetchAllJobs, fetchJobById, fetchJobsByCompany, fetchJobsByField, removeJob, updateJob} from '../controllers/jobController';

const jobRoute = express.Router();

jobRoute.route('/')
.get(fetchAllJobs)
.post(authenticate, addJob);
jobRoute.route('/:id')
.get(fetchJobById)
.put(authenticate, updateJob)
.delete(authenticate, removeJob);
jobRoute.get('/company', authenticate, fetchJobsByCompany);
jobRoute.get('/:field', fetchJobsByField);


export default jobRoute;

