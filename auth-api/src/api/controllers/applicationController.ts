import {Request, Response, NextFunction} from 'express';
import {Application, Message} from "@sharedTypes/DBTypes";
import {deleteApplication, getApplicationById, getApplicationsByJob, getApplicationsByUserId, getSavedApplicationsByUserId, getSentApplicationsByUserId, postApplication, putApplication, sendApplication} from "../models/applicationModel";
import CustomError from "../../classes/CustomError";
import {MessageResponse} from '@sharedTypes/MessageTypes';

export const handleGetApplicationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise <Application[] | void> => {
    try {
      const user_id = req.params.user_id;
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

export const handleGetSentApplicationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise <Application[] | void> => {
    try {
      const user_id = req.params.user_id;
      const applications = await getSentApplicationsByUserId(parseInt(user_id));
      if (applications.length === 0) {
        next(new CustomError('No sent applications found', 404));
        return;
      }
      res.json(applications);
    } catch (e) {
      next(new CustomError('Failed to get sent applications', 500));
    }
};

export const handleGetSavedApplicationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise <Application[] | void> => {
    try {
      const user_id = req.params.user_id;
      const applications = await getSavedApplicationsByUserId(parseInt(user_id));
      if (applications.length === 0) {
        next(new CustomError('No saved applications found', 404));
        return;
      }
      res.json(applications);
    } catch (e) {
      next(new CustomError('Failed to get saved applications', 500));
    }
};

export const handleGetApplicationById = async (
  req: Request,
  res: Response<Application>,
  next: NextFunction
  ): Promise <Application | void> => {
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

export const handlePostApplication = async (
  req: Request<{}, {}, Pick<Application, 'user_id' | 'application_id'>>,
  res: Response<Application>,
  next: NextFunction
  ): Promise <Application | void> => {
    try {
      const user_id = res.locals.user.user_id;
      const app_id = req.body.application_id;
      const application = await postApplication(user_id, app_id);
      if (application === null) {
        next(new CustomError('Failed to post application', 500));
        return;
      }
      res.json(application);
    } catch (e) {
      next(new CustomError('Failed to post application', 500));
    }
};

export const handlePutApplication = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
  ) => {
    try {
      const {application_text, application_links} = req.body;
      if (!application_text && !application_links) {
        next(new CustomError('No fields to update', 400));
        return;
      }

      const application_id = req.params.application_id;
      const user_id = res.locals.user.user_id;

      const application = await putApplication(user_id, parseInt(application_id), application_text, application_links);
      if (!application) {
        next(new CustomError('Failed to update application', 500));
        return;
      }
      const response: MessageResponse = {message: 'Application updated'};
      res.json(response);
    } catch (e) {
      next(new CustomError('Failed to update application', 500));
    }
};

export const handleDeleteApplication = async (
  req: Request<{application_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction
  ) => {
    try {
      const application_id = req.params.application_id;
      const user_id = res.locals.user.user_id;
      const application = await deleteApplication(user_id, parseInt(application_id));
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

export const handeSendApplication = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
  ) => {
    try {
      const user_id = res.locals.user.user_id;
      const application_id = req.params.application_id;
      const application = await sendApplication(user_id, parseInt(application_id));
      if (application === null) {
        next(new CustomError('Failed to send application', 500));
        return;
      }
      const response: MessageResponse = {message: 'Application sent'};
      res.json(response);
    } catch (e) {
      next(new CustomError('Failed to send application', 500));
    }
};

export const handleGetApplicationsByJob = async (
  req: Request,
  res: Response,
  next: NextFunction
  ): Promise <Application[] | void> => {
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
