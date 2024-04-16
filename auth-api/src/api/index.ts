import express from 'express';
import userRoute from './routes/userRoute';
import {MessageResponse} from '../../../hybrid-types/MessageTypes';
import authRoute from './routes/authRoute';
import testRoute from './routes/testRoute';

import profileRoute from './routes/profileRoute';
import chatsRoute from './routes/chatsRoute';
import applicationRoute from './routes/applicationRoute';
import jobRoute from './routes/jobRoute';
import swipeRoute from './routes/swipeRoute';
import matchRoute from './routes/matchRoute';
import notificationRoute from './routes/notificationRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({message: 'Connected!'});
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/profile', profileRoute);
router.use('/chats', chatsRoute);
router.use('/applications', applicationRoute);
router.use('/jobs', jobRoute);
router.use('/swipes', swipeRoute);
router.use('/matches', matchRoute);
router.use('/notifications', notificationRoute);
router.use('/tests', testRoute);

export default router;
