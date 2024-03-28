import express from 'express';
import {
  addMatch,
  getAllMatches,
  getUserMatches,
  removeMatch,
} from '../controllers/matchController';
import {authenticate} from '../../middlewares';

const matchRoute = express.Router();

matchRoute.route('/').get(getAllMatches).post(authenticate, addMatch);
matchRoute.route('/:id').delete(removeMatch);
matchRoute.route('/user/:id').get(authenticate, getUserMatches);


export default matchRoute;
