import express from 'express';
import { authenticate } from '../../middlewares';
import {addSwipe, getAllSwipes, getSwipe, getSwipeById, getSwipesRight, getUserRightSwipes, getUserSwipes, removeSwipe} from '../controllers/swipesController';

const swipeRoute = express.Router();

swipeRoute.route('/')
.get(getAllSwipes)
.post(authenticate, addSwipe);
swipeRoute.route('/:id')
.get(getSwipe)
.delete(removeSwipe);
swipeRoute.route('/user').get(authenticate, getUserSwipes);
swipeRoute.route('/right').get(getSwipesRight);
swipeRoute.route('/user/right').get(authenticate, getUserRightSwipes);
swipeRoute.route('/user/:id').get(getSwipeById);

export default swipeRoute;
