import express from 'express';
import {authenticate} from '../../middlewares';
import {
  handleGetAllReports,
  handleGetUnresolvedReports,
  handleGetResolvedReports,
  handleGetReportById,
  handleGetReportsByUser,
  handleGetReportedUsers,
  handleGetReportedJobs,
  handleSendReport,
  handleResolveReport,
  handleDeleteReport,
} from '../controllers/reportController';

const reportRoute = express.Router();

reportRoute.get('/all', authenticate, handleGetAllReports);
reportRoute.get('/unresolved', authenticate, handleGetUnresolvedReports);
reportRoute.get('/resolved', authenticate, handleGetResolvedReports);
reportRoute.get('/user', authenticate, handleGetReportsByUser);
reportRoute.get('/reported/users', authenticate, handleGetReportedUsers);
reportRoute.get('/reported/jobs', authenticate, handleGetReportedJobs);
reportRoute.route('/:id')
.get(authenticate, handleGetReportById)
.delete(authenticate, handleDeleteReport);
reportRoute.post('/', authenticate, handleSendReport);
reportRoute.put('/resolve/:id', authenticate, handleResolveReport);

export default reportRoute;
