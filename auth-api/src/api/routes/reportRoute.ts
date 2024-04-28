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

reportRoute
/**
 * @api {get} /reports/all Get all reports
 * @apiName GetAllReports
 * @apiGroup Reports
 * @apiDescription Get all reports
 * @apiAccess admin
 * @apiSuccess {Object[]} reports Reports array
 * @apiSuccess {Number} reports.report_id Report id
 * @apiSuccess {Number} reports.user_id User id
 * @apiSuccess {String} reports.reported_item_type Reported item type
 * @apiSuccess {Number} reports.reported_item_id Reported item id
 * @apiSuccess {String} reports.report_reason Report reason
 * @apiSuccess {Date} reports.reported_at Reported at
 * @apiSuccess {String} reports.is_resolved Is resolved status
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "report_id": 1,
 *   "user_id": 1,
 *   "reported_item_type": "User",
 *   "reported_item_id": 2,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "not_resolved"
 *  },
 *  {
 *   "report_id": 2,
 *   "user_id": 1,
 *   "reported_item_type": "Job",
 *   "reported_item_id": 3,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "resolved"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/all', authenticate, handleGetAllReports);
reportRoute
/**
 * @api {get} /reports/unresolved Get all unresolved reports
 * @apiName GetUnresolvedReports
 * @apiGroup Reports
 * @apiDescription Get all unresolved reports
 * @apiAccess admin
 * @apiSuccess {Object[]} reports Reports array
 * @apiSuccess {Number} reports.report_id Report id
 * @apiSuccess {Number} reports.user_id User id
 * @apiSuccess {String} reports.reported_item_type Reported item type
 * @apiSuccess {Number} reports.reported_item_id Reported item id
 * @apiSuccess {String} reports.report_reason Report reason
 * @apiSuccess {Date} reports.reported_at Reported at
 * @apiSuccess {String} reports.is_resolved Is resolved status
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "report_id": 1,
 *   "user_id": 1,
 *   "reported_item_type": "User",
 *   "reported_item_id": 2,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "not_resolved"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/unresolved', authenticate, handleGetUnresolvedReports);
reportRoute
/**
 * @api {get} /reports/resolved Get all resolved reports
 * @apiName GetResolvedReports
 * @apiGroup Reports
 * @apiDescription Get all resolved reports
 * @apiAccess admin
 * @apiSuccess {Object[]} reports Reports array
 * @apiSuccess {Number} reports.report_id Report id
 * @apiSuccess {Number} reports.user_id User id
 * @apiSuccess {String} reports.reported_item_type Reported item type
 * @apiSuccess {Number} reports.reported_item_id Reported item id
 * @apiSuccess {String} reports.report_reason Report reason
 * @apiSuccess {Date} reports.reported_at Reported at
 * @apiSuccess {String} reports.is_resolved Is resolved status
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "report_id": 2,
 *   "user_id": 1,
 *   "reported_item_type": "Job",
 *   "reported_item_id": 3,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "resolved"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/resolved', authenticate, handleGetResolvedReports);
reportRoute
/**
 * @api {get} /reports/user/:id Get reports by user
 * @apiName GetReportsByUser
 * @apiGroup Reports
 * @apiDescription Get reports by user
 * @apiAccess admin
 * @apiParam {Number} id User id
 * @apiSuccess {Object[]} reports Reports array
 * @apiSuccess {Number} reports.report_id Report id
 * @apiSuccess {Number} reports.user_id User id
 * @apiSuccess {String} reports.reported_item_type Reported item type
 * @apiSuccess {Number} reports.reported_item_id Reported item id
 * @apiSuccess {String} reports.report_reason Report reason
 * @apiSuccess {Date} reports.reported_at Reported at
 * @apiSuccess {String} reports.is_resolved Is resolved status
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "report_id": 1,
 *   "user_id": 1,
 *   "reported_item_type": "User",
 *   "reported_item_id": 2,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "not_resolved"
 *  },
 *  {
 *   "report_id": 2,
 *   "user_id": 1,
 *   "reported_item_type": "User",
 *   "reported_item_id": 3,
 *   "report_reason": "Inappropriate content",
 *   "reported_at": "2021-08-02T00:00:00.000Z",
 *   "is_resolved": "resolved"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/user/:id', authenticate, handleGetReportsByUser);
reportRoute
/**
 * @api {get} /reports/reported/users Get reported users
 * @apiName GetReportedUsers
 * @apiGroup Reports
 * @apiDescription Get reported users
 * @apiAccess admin
 * @apiSuccess {Object[]} users Users array
 * @apiSuccess {Number} users.user_id User id
 * @apiSuccess {String} users.username Username
 * @apiSuccess {String} users.fullname Full name
 * @apiSuccess {String} users.email Email
 * @apiSuccess {String} users.phone Phone
 * @apiSuccess {String} users.about_me About me
 * @apiSuccess {String} users.status Status
 * @apiSuccess {String} users.link Link
 * @apiSuccess {String} users.field Field
 * @apiSuccess {String} users.address Address
 * @apiSuccess {String} users.user_type User type
 * @apiSuccess {String} users.report_reason Report reason
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "user_id": 1,
 *   "username": "user1",
 *   "fullname": "User One",
 *   "email": "user1@example.com",
 *   "phone": "1234567890",
 *   "about_me": "About me",
 *   "status": "active",
 *   "link": "https://example.com",
 *   "field": "IT",
 *   "address": "1234 Example St, Example City, EX",
 *   "user_type": "candidate",
 *   "report_reason": "Inappropriate content"
 *  },
 *  {
 *   "user_id": 2,
 *   "username": "user2",
 *   "fullname": "User Two",
 *   "email": "user2@example.com",
 *   "phone": "1234567890",
 *   "about_me": "About me",
 *   "status": "active",
 *   "link": "https://example.com",
 *   "field": "IT",
 *   "address": "1234 Example St, Example City, EX",
 *   "user_type": "candidate",
 *   "report_reason": "Inappropriate content"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get('/reported/users', authenticate, handleGetReportedUsers);
reportRoute
/**
 * @api {get} /reports/reported/jobs Get reported jobs
 * @apiName GetReportedJobs
 * @apiGroup Reports
 * @apiDescription Get reported jobs
 * @apiAccess admin
 * @apiSuccess {Object[]} jobs Jobs array
 * @apiSuccess {Number} jobs.job_id Job id
 * @apiSuccess {String} jobs.job_address Job address
 * @apiSuccess {String} jobs.job_title Job title
 * @apiSuccess {String} jobs.salary Salary
 * @apiSuccess {Number} jobs.user_id User id
 * @apiSuccess {String} jobs.job_description Job description
 * @apiSuccess {Date} jobs.deadline_date Deadline date
 * @apiSuccess {String} jobs.field Field
 * @apiSuccess {String} jobs.report_reason Report reason
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "job_id": 1,
 *   "job_address": "1234 Example St, Example City, EX",
 *   "job_title": "Software Developer",
 *   "salary": "5000",
 *   "user_id": 1,
 *   "job_description": "We're looking for a software developer",
 *   "deadline_date": "2021-08-02T00:00:00.000Z",
 *   "field": "IT",
 *   "report_reason": "Inappropriate content"
 *  },
 *  {
 *   "job_id": 2,
 *   "job_address": "1234 Example St, Example City, EX",
 *   "job_title": "Barista",
 *   "salary": "2000",
 *   "user_id": 2,
 *   "job_description": "We're looking for a barista",
 *   "deadline_date": "2021-08-02T00:00:00.000Z",
 *   "field": "Hospitality",
 *   "report_reason": "Inappropriate content"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Reports not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.get('/reported/jobs', authenticate, handleGetReportedJobs);
reportRoute.route('/:id')
/**
 * @api {get} /reports/:id Get report by id
 * @apiName GetReportById
 * @apiGroup Reports
 * @apiDescription Get report by id
 * @apiAccess admin
 * @apiParam {Number} id Report id
 * @apiSuccess {Number} report_id Report id
 * @apiSuccess {Number} user_id User id
 * @apiSuccess {String} reported_item_type Reported item type
 * @apiSuccess {Number} reported_item_id Reported item id
 * @apiSuccess {String} report_reason Report reason
 * @apiSuccess {Date} reported_at Reported at
 * @apiSuccess {String} is_resolved Is resolved status
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "report_id": 1,
 *  "user_id": 1,
 *  "reported_item_type": "User",
 *  "reported_item_id": 2,
 *  "report_reason": "Inappropriate content",
 *  "reported_at": "2021-08-02T00:00:00.000Z",
 *  "is_resolved": "not_resolved"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Report not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to view reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.get(authenticate, handleGetReportById)
/**
 * @api {delete} /reports/:id Delete report
 * @apiName DeleteReport
 * @apiGroup Reports
 * @apiDescription Delete report
 * @apiAccess admin
 * @apiParam {Number} id Report id
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Report deleted"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to delete reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Report not found"
 * }
 */
.delete(authenticate, handleDeleteReport);
reportRoute
/**
 * @api {post} /reports Send report
 * @apiName SendReport
 * @apiGroup Reports
 * @apiDescription Send report
 * @apiAccess user
 * @apiParam {Number} reported_item_id Reported item id
 * @apiParam {String} reported_item_type Reported item type
 * @apiParam {String} report_reason Report reason
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Report sent"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Report not sent"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.post('/', authenticate, handleSendReport);
reportRoute
/**
 * @api {put} /reports/resolve/:id Resolve report
 * @apiName ResolveReport
 * @apiGroup Reports
 * @apiDescription Resolve report
 * @apiAccess admin
 * @apiParam {Number} id Report id
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "message": "Report resolved"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Report not resolved"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden
 * {
 *  "message": "You do not have permission to resolve reports"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "Report not found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.put('/resolve/:id', authenticate, handleResolveReport);

export default reportRoute;
