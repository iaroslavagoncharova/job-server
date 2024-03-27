import express from 'express';
import { authenticate } from '../../middlewares';
import {handleGetApplicationById, handleGetApplicationsByUserId, handleGetSavedApplicationsByUserId, handleGetSentApplicationsByUserId, handlePostApplication, handlePutApplication, handleDeleteApplication, handeSendApplication, handleGetApplicationsByJob} from '../controllers/applicationController';

const applicationRoute = express.Router();

// routes for job applications

applicationRoute.get('/user', authenticate, handleGetApplicationsByUserId);
applicationRoute.get('/user/sent', authenticate, handleGetSentApplicationsByUserId);
applicationRoute.get('/user/saved', authenticate, handleGetSavedApplicationsByUserId);

applicationRoute.get('/:application_id', authenticate, handleGetApplicationById);

applicationRoute.get('/job/:job_id', authenticate, handleGetApplicationsByJob);

applicationRoute.post('/', authenticate, handlePostApplication);

applicationRoute.put('/:application_id', authenticate, handlePutApplication);
applicationRoute.put('/application_id/send', authenticate, handeSendApplication);

applicationRoute.delete('/:application_id', authenticate, handleDeleteApplication);

export default applicationRoute;
