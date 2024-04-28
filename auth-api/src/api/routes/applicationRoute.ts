import express from 'express';
import {authenticate} from '../../middlewares';
import {
  handleGetApplicationById,
  handleGetApplicationsByUserId,
  handleGetSavedApplicationsByUserId,
  handleGetSentApplicationsByUserId,
  handlePostApplication,
  handlePutApplication,
  handleDeleteApplication,
  handeSendApplication,
  handleGetApplicationsByJob,
  handleDismissApplication,
  handleAcceptApplication,
  handleGetApplicationsForChat,
} from '../controllers/applicationController';

const applicationRoute = express.Router();

// routes for job applications

applicationRoute.post('/', authenticate, handlePostApplication);
applicationRoute
/**
 * @api {get} /applications Get all applications by user id
 * @apiName GetApplicationsByUserId
 * @apiGroup Applications
 * @apiDescription Get all applications by user id
 * @apiAccess user
 * @apiSuccess {Object[]} applications Applications array
 * @apiSuccess {Number} applications.application_id Application id
 * @apiSuccess {Number} applications.user_id User id
 * @apiSuccess {Number} applications.job_id Job id
 * @apiSuccess {String} applications.status Application status
 * @apiSuccess {String} applications.application_text Application text
 * @apiSuccess {Date} applications.created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "application_id": 1,
 *   "user_id": 1,
 *   "job_id": 1,
 *   "status": "Pending",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "application_id": 2,
 *   "user_id": 1,
 *   "job_id": 2,
 *   "status": "Submitted",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.get('/user', authenticate, handleGetApplicationsByUserId);
applicationRoute
/**
 * @api {get} /applications/sent Get all sent applications by user id
 * @apiName GetSentApplicationsByUserId
 * @apiGroup Applications
 * @apiDescription Get all sent applications by user id
 * @apiAccess user
 * @apiSuccess {Object[]} applications Applications array
 * @apiSuccess {Number} applications.application_id Application id
 * @apiSuccess {Number} applications.user_id User id
 * @apiSuccess {Number} applications.job_id Job id
 * @apiSuccess {String} applications.status Application status
 * @apiSuccess {String} applications.application_text Application text
 * @apiSuccess {Date} applications.created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "application_id": 2,
 *   "user_id": 1,
 *   "job_id": 2,
 *   "status": "Submitted",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No sent applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(
  '/user/sent',
  authenticate,
  handleGetSentApplicationsByUserId
);
applicationRoute
/**
 * @api {get} /applications/saved Get all saved applications by user id
 * @apiName GetSavedApplicationsByUserId
 * @apiGroup Applications
 * @apiDescription Get all saved applications by user id
 * @apiAccess user
 * @apiSuccess {Object[]} applications Applications array
 * @apiSuccess {Number} applications.application_id Application id
 * @apiSuccess {Number} applications.user_id User id
 * @apiSuccess {Number} applications.job_id Job id
 * @apiSuccess {String} applications.status Application status
 * @apiSuccess {String} applications.application_text Application text
 * @apiSuccess {Date} applications.created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "application_id": 1,
 *   "user_id": 1,
 *   "job_id": 1,
 *   "status": "Pending",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No saved applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(
  '/user/saved',
  authenticate,
  handleGetSavedApplicationsByUserId
);
applicationRoute
/**
 * @api {get} /applications/chat/:id Get all applications for chat by employer id
 * @apiName GetApplicationsForChat
 * @apiGroup Applications
 * @apiDescription Get all applications by user for chat by employer id
 * @apiAccess user
 * @apiSuccess {Object[]} applications Applications array
 * @apiSuccess {Number} applications.application_id Application id
 * @apiSuccess {Number} applications.user_id User id
 * @apiSuccess {Number} applications.job_id Job id
 * @apiSuccess {String} applications.status Application status
 * @apiSuccess {String} applications.application_text Application text
 * @apiSuccess {Date} applications.created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   {
 *   "application_id": 1,
 *   "user_id": 1,
 *   "job_id": 1,
 *   "status": "Pending",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/user/:id', authenticate, handleGetApplicationsForChat);

applicationRoute
/**
 * @api {get} /applications/:application_id Get application by id
 * @apiName GetApplicationById
 * @apiGroup Applications
 * @apiDescription Get application by id
 * @apiAccess user
 * @apiSuccess {Number} application_id Application id
 * @apiSuccess {Number} user_id User id
 * @apiSuccess {Number} job_id Job id
 * @apiSuccess {String} status Application status
 * @apiSuccess {String} application_text Application text
 * @apiSuccess {Date} created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "application_id": 1,
 *   "user_id": 1,
 *   "job_id": 1,
 *   "status": "Pending",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(
  '/:application_id',
  authenticate,
  handleGetApplicationById
);
applicationRoute
/**
 * @api {put} /applications/:application_id Update application
 * @apiName UpdateApplication
 * @apiGroup Applications
 * @apiDescription Update application
 * @apiAccess user
 * @apiParam {String} application_text Application text
 * @apiParam {String} application_links Application links
 * @apiSuccess {String} message Application updated
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Application updated"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "No fields to update"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to update application"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.put('/:application_id', authenticate, handlePutApplication);
applicationRoute
/**
 * @api {put} /applications/dismiss/:application_id Dismiss application
 * @apiName DismissApplication
 * @apiGroup Applications
 * @apiDescription Dismiss application
 * @apiAccess user
 * @apiSuccess {String} message Application dismissed
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Application dismissed"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to dismiss application"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.put(
  '/dismiss/:application_id',
  authenticate,
  handleDismissApplication
);
applicationRoute
/**
 * @api {put} /applications/accept/:application_id Accept application
 * @apiName AcceptApplication
 * @apiGroup Applications
 * @apiDescription Accept application
 * @apiAccess user
 * @apiSuccess {String} message Application accepted
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Application accepted"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to accept application"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.put(
  '/accept/:application_id',
  authenticate,
  handleAcceptApplication
);
applicationRoute
/**
 * @api {delete} /applications/:application_id Delete application
 * @apiName DeleteApplication
 * @apiGroup Applications
 * @apiDescription Delete application
 * @apiAccess user
 * @apiSuccess {String} message Application deleted
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Application deleted"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to delete application"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.delete(
  '/:application_id',
  authenticate,
  handleDeleteApplication
);

applicationRoute
/**
 * @api {get} /applications/job/:job_id Get all applications by job id
 * @apiName GetApplicationsByJob
 * @apiGroup Applications
 * @apiDescription Get all applications by job id
 * @apiAccess user
 * @apiSuccess {Object[]} applications Applications array
 * @apiSuccess {Number} applications.application_id Application id
 * @apiSuccess {Number} applications.user_id User id
 * @apiSuccess {Number} applications.job_id Job id
 * @apiSuccess {String} applications.status Application status
 * @apiSuccess {String} applications.application_text Application text
 * @apiSuccess {Date} applications.created_at Application created at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *   *  {
 *   "application_id": 1,
 *   "user_id": 1,
 *   "job_id": 1,
 *   "status": "Submitted",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "application_id": 2,
 *   "user_id": 2,
 *   "job_id": 1,
 *   "status": "Submitted",
 *   "application_text": "I am interested in this job",
 *   "created_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No applications found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/job/:job_id', authenticate, handleGetApplicationsByJob);

applicationRoute
/**
 * @api {put} /applications/:application_id/send Send application
 * @apiName SendApplication
 * @apiGroup Applications
 * @apiDescription Send application
 * @apiAccess user
 * @apiSuccess {String} message Application sent
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Application sent"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to send application"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.put(
  '/:application_id/send',
  authenticate,
  handeSendApplication
);

export default applicationRoute;
