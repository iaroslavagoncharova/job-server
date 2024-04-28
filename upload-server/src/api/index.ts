import express from 'express';

import fileRoute from './routes/fileRoute';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const router = express.Router();
const path = require('path');

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'routes: /upload, /delete, /download/:filename',
  });
});

router.use('/', fileRoute);

export default router;
