import express from 'express';
import userRoute from './routes/userRoute';
import {MessageResponse} from '../../../hybrid-types/MessageTypes';
import authRoute from './routes/authRoute';

import profileRoute from './routes/profileRoute';
import chatsRoute from './routes/chatsRoute';
import applicationRoute from './routes/applicationRoute';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({ message: 'Connected!' });
});

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/profile', profileRoute);
router.use('/chats', chatsRoute);
router.use('/applications', applicationRoute);

export default router;
