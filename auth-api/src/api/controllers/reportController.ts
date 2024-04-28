import {NextFunction, Response, Request} from 'express';
import CustomError from '../../classes/CustomError';
import {
  getAllReports,
  getUnresolvedReports,
  getResolvedReports,
  getReportById,
  getReportsByUser,
  getReportedUsers,
  getReportedJobs,
  sendReport,
  resolveReport,
  deleteReport,
} from '../models/reportModel';
import {Report, ReportedJob, ReportedUser, User} from '@sharedTypes/DBTypes';
import {MessageResponse} from '@sharedTypes/MessageTypes';

const handleGetAllReports = async (
  req: Request,
  res: Response<Report[]>,
  next: NextFunction
): Promise<Report[] | void> => {
  try {
    const reports = await getAllReports(res.locals.user.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetUnresolvedReports = async (
  req: Request,
  res: Response<Report[]>,
  next: NextFunction
): Promise<Report[] | void> => {
  try {
    const reports = await getUnresolvedReports(res.locals.user.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetResolvedReports = async (
  req: Request,
  res: Response<Report[]>,
  next: NextFunction
): Promise<Report[] | void> => {
  try {
    const reports = await getResolvedReports(res.locals.user.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetReportById = async (
  req: Request<{id: string}>,
  res: Response<Report>,
  next: NextFunction
): Promise<Report | void> => {
  try {
    const report = await getReportById(
      parseInt(req.params.id),
      res.locals.user.user_id
    );
    if (report === null) {
      next(new CustomError('Report not found', 404));
      return;
    }
    res.json(report);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetReportsByUser = async (
  req: Request<{id: string}>,
  res: Response<Report[]>,
  next: NextFunction
): Promise<Report[] | void> => {
  try {
    const tokenUser = res.locals.user as User;
    const reports = await getReportsByUser(parseInt(req.params.id), tokenUser.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetReportedUsers = async (
  req: Request,
  res: Response<ReportedUser[]>,
  next: NextFunction
): Promise<ReportedUser[] | void> => {
  try {
    const reports = await getReportedUsers(res.locals.user.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleGetReportedJobs = async (
  req: Request,
  res: Response<ReportedJob[]>,
  next: NextFunction
): Promise<ReportedJob[] | void> => {
  try {
    const reports = await getReportedJobs(res.locals.user.user_id);
    if (reports === null) {
      next(new CustomError('Reports not found', 404));
      return;
    }
    res.json(reports);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleSendReport = async (
  req: Request<{}, {}, {reported_item_id: number; reported_item_type: string; report_reason: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const tokenUser = res.locals.user;
    const {reported_item_id, reported_item_type, report_reason} = req.body;
    const result = await sendReport(
      tokenUser.user_id,
      reported_item_type,
      reported_item_id,
      report_reason
    );
    if (result.message === 'Report sent') {
      res.json(result);
      return;
    }
    next(new CustomError('Report not sent', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleResolveReport = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const result = await resolveReport(
      parseInt(req.params.id),
      res.locals.user.user_id
    );
    if (result.message === 'Report resolved') {
      res.json(result);
      return;
    }
    next(new CustomError('Report not resolved', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

const handleDeleteReport = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const result = await deleteReport(
      parseInt(req.params.id),
      res.locals.user.user_id
    );
    if (result.message === 'Report deleted') {
      res.json(result);
      return;
    }
    next(new CustomError('Report not deleted', 500));
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export {
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
};
