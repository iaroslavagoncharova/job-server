import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import {deleteNotification, getNotificationsByUser, postNotification} from '../models/notificartionModel';
import {Notification} from '@sharedTypes/DBTypes';
import {MessageResponse, NotificationResponse} from '@sharedTypes/MessageTypes';

const getUserNotifications = async (
  req: Request,
  res: Response<NotificationResponse[]>,
  next: NextFunction
): Promise<NotificationResponse[] | void> => {
  try {
    const tokenUser = res.locals.user;
    const notifications = await getNotificationsByUser(tokenUser.user_id);
    if (!notifications) {
      next(new CustomError('No notifications found', 404));
      return;
    }
    res.json(notifications);
  } catch (error) {
    return next(error);
  }
};

const addNotification = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const match_id = req.body.match_id;
    const notification = await postNotification(match_id);
    if (!notification) {
      next(new CustomError('Notification not created', 500));
      return;
    }
    res.json(notification);
  } catch (error) {
    return next(error);
  }
};

const removeNotification = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const id = req.params.id;
    const notification = await deleteNotification(+id);
    if (!notification) {
      next(new CustomError('Notification not found', 404));
      return;
    }
    res.json(notification);
  } catch (error) {
    return next(error);
  }
};

export {getUserNotifications, addNotification, removeNotification};
