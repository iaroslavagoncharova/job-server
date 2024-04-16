import express from 'express';
import {authenticate} from '../../middlewares';
import {
  handleDeleteTest,
  handleGetTests,
  handleGetTestsByUser,
  handlePostTest,
  handlePutTest,
} from '../controllers/testController';

const testRoute = express.Router();

testRoute.route('/').get(handleGetTests).post(authenticate, handlePostTest)
testRoute.get('/byuser', authenticate, handleGetTestsByUser);
testRoute.route('/:id')
.put(authenticate, handlePutTest)
.delete(authenticate, handleDeleteTest);
export default testRoute;
