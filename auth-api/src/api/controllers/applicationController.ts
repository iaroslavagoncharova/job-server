import {Request, Response, NextFunction} from 'express';
import {Application, Message} from '@sharedTypes/DBTypes';
import {
  acceptApplication,
  deleteApplication,
  dismissApplication,
  getApplicationById,
  getApplicationsByJob,
  getApplicationsByUserId,
  getApplicationsForChat,
  getSavedApplicationsByUserId,
  getSentApplicationsByUserId,
  postApplication,
  putApplication,
  sendApplication,
} from '../models/applicationModel';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from '@sharedTypes/MessageTypes';

// toimii
export const handleGetApplicationsByUserId = async (
  req: Request<{}, {}, {}, {user_id: string}>,
  res: Response<Application[]>,
  next: NextFunction
): Promise<Application[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const applications = await getApplicationsByUserId(parseInt(user_id));
    if (applications.length === 0) {
      next(new CustomError('No applications found', 404));
      return;
    }
    res.json(applications);
  } catch (e) {
    next(new CustomError('Failed to get applications', 500));
  }
};

export const handleGetApplicationsForChat = async (
  req: Request<{id: string}>,
  res: Response<Application[]>,
  next: NextFunction
): Promise<Application[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const user2_id = parseInt(req.params.id);
    console.log(user_id, user2_id);
    const applications = await getApplicationsForChat(user_id, user2_id);
    if (!applications) {
      next(new CustomError('No applications found', 404));
      return;
    }
    res.json(applications);
  } catch (e) {
    next(new CustomError('Failed to get applications', 500));
  }
};

// toimii
// getting all sent applications for sent-page
// status = "Submitted" in database
export const handleGetSentApplicationsByUserId = async (
  req: Request<{}, {}, {}, {user_id: string}>,
  res: Response<Application[]>,
  next: NextFunction
): Promise<Application[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const applications = await getSentApplicationsByUserId(parseInt(user_id));
    if (!applications) {
      next(new CustomError('No sent applications found', 404));
      return;
    }
    res.json(applications);
  } catch (e) {
    next(new CustomError('Failed to get sent applications', 500));
  }
};

// toimii
// getting all saved job ads aka pre-made applications for saved-page
// status = "Pending" in database
export const handleGetSavedApplicationsByUserId = async (
  req: Request<{}, {}, {}, {user_id: string}>,
  res: Response<Application[]>,
  next: NextFunction
): Promise<Application[] | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const applications = await getSavedApplicationsByUserId(parseInt(user_id));
    if (!applications) {
      next(new CustomError('No saved applications found', 404));
      return;
    }
    res.json(applications);
  } catch (e) {
    next(new CustomError('Failed to get saved applications', 500));
  }
};

export const handleGetApplicationsByJob = async (
  req: Request<{job_id: string}>,
  res: Response<Application[]>,
  next: NextFunction
): Promise<Application[] | void> => {
  try {
    const job_id = req.params.job_id;
    const applications = await getApplicationsByJob(parseInt(job_id));
    if (applications.length === 0) {
      next(new CustomError('No applications found', 404));
      return;
    }
    res.json(applications);
  } catch (e) {
    next(new CustomError('Failed to get applications', 500));
  }
};
// toimii
// getting all application info after clicking it
export const handleGetApplicationById = async (
  req: Request<{application_id: string}>,
  res: Response<Application>,
  next: NextFunction
): Promise<Application | void> => {
  try {
    const application_id = req.params.application_id;
    const application = await getApplicationById(parseInt(application_id));
    if (application === null) {
      next(new CustomError('Application not found', 404));
      return;
    }
    res.json(application);
  } catch (e) {
    next(new CustomError('Failed to get application', 500));
  }
};

// toimii
// post application
export const handlePostApplication = async (
  req: Request<{}, {}, Pick<Application, 'user_id' | 'job_id'>>,
  res: Response<Application>,
  next: NextFunction
): Promise<Application | void> => {
  try {
    const user_id = res.locals.user.user_id; // user_id from token
    const job_id = req.body.job_id; // application_id from request body
    const application = await postApplication(user_id, job_id);
    if (application === null) {
      next(new CustomError('Failed to post application', 500));
      return;
    }
    res.json(application);
  } catch (e) {
    next(new CustomError('Failed to post application', 500));
  }
};

// toimii
export const handlePutApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const {application_text, application_links} = req.body;
    if (!application_text && !application_links) {
      next(new CustomError('No fields to update', 400));
      return;
    }

    const application_id = parseInt(req.params.application_id);
    const user_id = res.locals.user.user_id;

    const application = await putApplication(
      user_id,
      application_id,
      application_text,
      application_links
    );
    if (!application) {
      next(new CustomError('Failed to update application', 500));
      return;
    }
    const response: MessageResponse = {message: 'Application updated'};
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

// toimii
export const handleDeleteApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const application_id = req.params.application_id;
    const user_id = res.locals.user.user_id;
    const application = await deleteApplication(
      user_id,
      parseInt(application_id)
    );
    if (!application) {
      next(new CustomError('Failed to delete application', 500));
      return;
    }
    const response: MessageResponse = {message: 'Application deleted'};
    res.json(response);
  } catch (e) {
    next(new CustomError('Failed to delete application', 500));
  }
};

export const handleDismissApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const application_id = req.params.application_id;
    const application = await dismissApplication(parseInt(application_id));
    if (!application) {
      next(new CustomError('Failed to dismiss application', 500));
      return;
    }
    const response: MessageResponse = {message: 'Application dismissed'};
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

// toimii
export const handeSendApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const user_id = res.locals.user.user_id;
    const application_id = req.params.application_id;
    const application = await sendApplication(
      user_id,
      parseInt(application_id)
    );
    if (application === null) {
      next(new CustomError('Failed to send application', 500));
      return;
    }
    const response: MessageResponse = {message: 'Application sent'};
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};

export const handleAcceptApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
): Promise<MessageResponse | void> => {
  try {
    const application_id = req.params.application_id;
    const application = await acceptApplication(parseInt(application_id));
    if (!application) {
      next(new CustomError('Failed to accept application', 500));
      return;
    }
    const response: MessageResponse = {message: 'Application accepted'};
    res.json(response);
  } catch (e) {
    next(new CustomError((e as Error).message, 500));
  }
};
