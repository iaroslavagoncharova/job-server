import express from 'express';
import { authenticate } from '../../middlewares';
import {addJob, fetchAllJobs, fetchFields, fetchJobById, fetchJobsByCompany, fetchJobsByField, removeJob, updateJob} from '../controllers/jobController';

const jobRoute = express.Router();

jobRoute.route('/')
.get(authenticate, fetchAllJobs)
.post(authenticate, addJob);
jobRoute.get('/fields', fetchFields);
jobRoute.route('/:id')
.get(fetchJobById)
.put(authenticate, updateJob)
.delete(authenticate, removeJob);
jobRoute.get('/company', authenticate, fetchJobsByCompany);
jobRoute.get('/:field', fetchJobsByField);


export default jobRoute;

