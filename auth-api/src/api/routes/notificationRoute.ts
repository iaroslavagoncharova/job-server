import express from 'express';
import {
  addNotification,
  getUserNotifications,
  removeNotification,
} from '../controllers/notificationController';
import {authenticate} from '../../middlewares';

const notificationRoute = express.Router();

notificationRoute
  .route('/')
  .get(authenticate, getUserNotifications)
  .post(addNotification);

notificationRoute.route('/:id').delete(removeNotification);

export default notificationRoute;
