import express from 'express';
import {authenticate} from '../../middlewares';
import {
  handleAddTestToJob,
  handleDeleteJobFromTest,
  handleDeleteTest,
  handleGetAllTests,
  handleGetCandidatesTests,
  handleGetJobsByTest,
  handleGetTests,
  handleGetTestsByUser,
  handleGetTestsForJob,
  handlePostTest,
  handlePutTest,
  handleTakeTest,
} from '../controllers/testController';

const testRoute = express.Router();
testRoute.get('/all', handleGetAllTests)
testRoute.route('/').get(handleGetTests).post(authenticate, handlePostTest)
testRoute.get('/byuser', authenticate, handleGetTestsByUser);
testRoute.get('/candidate', authenticate, handleGetCandidatesTests);
testRoute.route('/:id')
.put(authenticate, handlePutTest)
.delete(authenticate, handleDeleteTest);
testRoute.route('/job/:id').get(authenticate, handleGetTestsForJob).post(authenticate, handleAddTestToJob);
testRoute.route('/test/:id').get(authenticate, handleGetJobsByTest).delete(authenticate, handleDeleteJobFromTest);
testRoute.post('/take/test/:id', authenticate, handleTakeTest);
export default testRoute;
