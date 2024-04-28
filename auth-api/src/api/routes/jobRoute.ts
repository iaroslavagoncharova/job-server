import express from 'express';
import {authenticate} from '../../middlewares';
import {
  addJob,
  fetchAllJobs,
  fetchFields,
  fetchJobById,
  fetchJobForApplication,
  fetchJobsByCompany,
  fetchJobsByField,
  fetchKeywords,
  handleCalculatePercentage,
  removeJob,
  removeJobAsAdmin,
  updateJob,
} from '../controllers/jobController';

const jobRoute = express.Router();

jobRoute
  .route('/')
  /**
   * @api {get} /jobs Get all jobs
   * @apiName GetJobs
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Get all jobs (unswiped)
   * @apiSuccess {Object[]} jobs List of jobs
   * @apiSuccess {Number} jobs.job_id Job ID
   * @apiSuccess {String} jobs.job_address Job address
   * @apiSuccess {String} jobs.job_title Job title
   * @apiSuccess {String} jobs.salary Salary
   * @apiSuccess {Number} jobs.user_id User ID
   * @apiSuccess {String} jobs.job_description Job description
   * @apiSuccess {Date} jobs.deadline_date Deadline date
   * @apiSuccess {String} jobs.field Field
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "jobs": [
   *           {
   *            "job_id": 1,
   *            "job_address": "123 Main St",
   *            "job_title": "Software Engineer",
   *            "salary": "8000",
   *            "user_id": 1,
   *            "job_description": "We are looking for a software engineer",
   *            "deadline_date": "2021-01-01T00:00:00.000Z",
   *            "field": "IT"
   *           },
   *           {
   *            "job_id": 2,
   *            "job_address": "456 Elm St",
   *            "job_title": "Data Analyst",
   *            "salary": "7000",
   *            "user_id": 2,
   *            "job_description": "We are looking for a data analyst",
   *            "deadline_date": "2021-01-01T00:00:00.000Z",
   *            "field": "IT"
   *           }
   *         ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No jobs found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get(authenticate, fetchAllJobs)
  /**
   * @api {post} /jobs Add job
   * @apiName AddJob
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Add job
   * @apiParam {String} job_address Job address
   * @apiParam {String} job_title Job title
   * @apiParam {String} salary Salary
   * @apiParam {String} job_description Job description
   * @apiParam {Date} deadline_date Deadline date
   * @apiParam {String} field Field
   * @apiParam {String} skills Skills
   * @apiParam {String} keywords Keywords
   * @apiSuccess {String} message Job added
   * @apiSuccess {Object} job Job
   * @apiSuccess {Number} job.job_id Job ID
   * @apiSuccess {String} job.job_address Job address
   * @apiSuccess {String} job.job_title Job title
   * @apiSuccess {String} job.salary Salary
   * @apiSuccess {Number} job.user_id User ID
   * @apiSuccess {String} job.job_description Job description
   * @apiSuccess {Date} job.deadline_date Deadline date
   * @apiSuccess {String} job.field Field
   * @apiSuccess {String} job.skills Skills
   * @apiSuccess {String} job.keywords Keywords
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Job added",
   *  "job": {
   *            "job_id": 2,
   *            "job_address": "456 Elm St",
   *            "job_title": "Data Analyst",
   *            "salary": "7000",
   *            "user_id": 2,
   *            "job_description": "We are looking for a data analyst",
   *            "deadline_date": "2021-01-01T00:00:00.000Z",
   *            "field": "IT",
   *            "skills": "Python, Java",
   *            "keywords": "Data, Analyst"
   *          }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Job creation failed"
   * }
   *
   */
  .post(authenticate, addJob);
jobRoute
  /**
   * @api {get} /fields Get fields
   * @apiName GetFields
   * @apiGroup Jobs
   * @apiPermission all
   * @apiDescription Get fields
   * @apiSuccess {String[]} fields List of fields
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "fields": [
   *              "IT",
   *              "Engineering",
   *              "Healthcare"
   *            ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No fields found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/fields', fetchFields);
jobRoute
  /**
   * @api {get} /keywords Get keywords
   * @apiName GetKeywords
   * @apiGroup Jobs
   * @apiPermission all
   * @apiDescription Get keywords
   * @apiSuccess {Object} keywords List of keywords
   * @apiSuccess {Number} keywords.keyword_id Keyword ID
   * @apiSuccess {String} keywords.keyword_name Keyword name
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "keywords": [
   *               {
   *                "keyword_id": 1,
   *                "keyword_name": "Software"
   *               },
   *               {
   *                "keyword_id": 2,
   *                "keyword_name": "Engineer"
   *               }
   *            ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No keywords found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .get('/keywords', fetchKeywords);
jobRoute
  /**
   * @api {get} /company Get jobs by company
   * @apiName GetJobsByCompany
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Get jobs by company
   * @apiSuccess {Object[]} jobs List of jobs
   * @apiSuccess {Number} jobs.job_id Job ID
   * @apiSuccess {String} jobs.job_address Job address
   * @apiSuccess {String} jobs.job_title Job title
   * @apiSuccess {String} jobs.salary Salary
   * @apiSuccess {Number} jobs.user_id User ID
   * @apiSuccess {String} jobs.job_description Job description
   * @apiSuccess {Date} jobs.deadline_date Deadline date
   * @apiSuccess {String} jobs.field Field
   * @apiSuccess {String} jobs.skills Skills
   * @apiSuccess {String} jobs.keywords Keywords
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "job": {
   *          "job_id": 1,
   *          "job_address": "123 Main St",
   *          "job_title": "Software Engineer",
   *          "salary": "8000",
   *          "user_id": 1,
   *          "job_description": "We are looking for a software engineer",
   *          "deadline_date": "2021-01-01T00:00:00.000Z",
   *          "field": "IT",
   *          "skills": "Java, Python",
   *          "keywords": "Software, Engineer"
   *         }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No jobs found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/company', authenticate, fetchJobsByCompany);
jobRoute
  .route('/:id')
  /**
   * @api {get} /:id Get job by ID
   * @apiName GetJobById
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Get job by ID
   * @apiParam {Number} id Job ID
   * @apiSuccess {Object} job Job
   * @apiSuccess {Number} job.job_id Job ID
   * @apiSuccess {String} job.job_address Job address
   * @apiSuccess {String} job.job_title Job title
   * @apiSuccess {String} job.salary Salary
   * @apiSuccess {Number} job.user_id User ID
   * @apiSuccess {String} job.job_description Job description
   * @apiSuccess {Date} job.deadline_date Deadline date
   * @apiSuccess {String} job.field Field
   * @apiSuccess {String} job.skills Skills
   * @apiSuccess {String} job.keywords Keywords
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "job": {
   *          "job_id": 1,
   *          "job_address": "123 Main St",
   *          "job_title": "Software Engineer",
   *          "salary": "8000",
   *          "user_id": 1,
   *          "job_description": "We are looking for a software engineer",
   *          "deadline_date": "2021-01-01T00:00:00.000Z",
   *          "field": "IT",
   *          "skills": "Java, Python",
   *          "keywords": "Software, Engineer"
   *         }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Job not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get(fetchJobById)
  /**
   * @api {put} /:id Update job
   * @apiName UpdateJob
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Update job
   * @apiParam {Number} id Job ID
   * @apiParam {String} [job_address] Job address
   * @apiParam {String} [job_title] Job title
   * @apiParam {String} [salary] Salary
   * @apiParam {String} [job_description] Job description
   * @apiParam {Date} [deadline_date] Deadline date
   * @apiParam {String} [field] Field
   * @apiParam {String} [skills] Skills
   * @apiParam {String} [keywords] Keywords
   * @apiSuccess {String} message Job updated
   * @apiSuccess {Object} job Job
   * @apiSuccess {Number} job.job_id Job ID
   * @apiSuccess {String} job.job_address Job address
   * @apiSuccess {String} job.job_title Job title
   * @apiSuccess {String} job.salary Salary
   * @apiSuccess {Number} job.user_id User ID
   * @apiSuccess {String} job.job_description Job description
   * @apiSuccess {Date} job.deadline_date Deadline date
   * @apiSuccess {String} job.field Field
   * @apiSuccess {String} job.skills Skills
   * @apiSuccess {String} job.keywords Keywords
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Job updated",
   *  "job": {
   *          "job_id": 1,
   *          "job_address": "123 Main St",
   *          "job_title": "Software Engineer",
   *          "salary": "8000",
   *          "user_id": 1,
   *          "job_description": "We are looking for a software engineer",
   *          "deadline_date": "2021-01-01T00:00:00.000Z",
   *          "field": "IT",
   *          "skills": "Java, Python",
   *          "keywords": "Software, Engineer"
   *         }
   * }
   */
  .put(authenticate, updateJob)
  /**
   * @api {delete} /:id Remove job
   * @apiName RemoveJob
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Remove job
   * @apiParam {Number} id Job ID
   * @apiSuccess {String} message Job removed
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Job deleted"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Job not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Job deletion failed"
   * }
   */
  .delete(authenticate, removeJob);
jobRoute
  /**
   * @api {get} /application/:job_id Get job for application
   * @apiName GetJobForApplication
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Get job for application
   * @apiParam {Number} job_id Job ID
   * @apiSuccess {Object} job Job
   * @apiSuccess {Number} job.job_id Job ID
   * @apiSuccess {String} job.job_address Job address
   * @apiSuccess {String} job.job_title Job title
   * @apiSuccess {String} job.salary Salary
   * @apiSuccess {Number} job.user_id User ID
   * @apiSuccess {String} job.job_description Job description
   * @apiSuccess {Date} job.deadline_date Deadline date
   * @apiSuccess {String} job.field Field
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "job": {
   *          "job_id": 1,
   *          "job_address": "123 Main St",
   *          "job_title": "Software Engineer",
   *          "salary": "8000",
   *          "user_id": 1,
   *          "job_description": "We are looking for a software engineer",
   *          "deadline_date": "2021-01-01T00:00:00.000Z",
   *          "field": "IT"
   *         }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Job not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/application/:job_id', authenticate, fetchJobForApplication);
jobRoute
  /**
   * @api {get} /:field Get jobs by field
   * @apiName GetJobsByField
   * @apiGroup Jobs
   * @apiPermission all
   * @apiDescription Get jobs by field
   * @apiParam {String} field Field
   * @apiSuccess {Object[]} jobs List of jobs
   * @apiSuccess {Number} jobs.job_id Job ID
   * @apiSuccess {String} jobs.job_address Job address
   * @apiSuccess {String} jobs.job_title Job title
   * @apiSuccess {String} jobs.salary Salary
   * @apiSuccess {Number} jobs.user_id User ID
   * @apiSuccess {String} jobs.job_description Job description
   * @apiSuccess {Date} jobs.deadline_date Deadline date
   * @apiSuccess {String} jobs.field Field
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "jobs": [
   *           {
   *            "job_id": 1,
   *            "job_address": "123 Main St",
   *            "job_title": "Software Engineer",
   *            "salary": "8000",
   *            "user_id": 1,
   *            "job_description": "We are looking for a software engineer",
   *            "deadline_date": "2021-01-01T00:00:00.000Z",
   *            "field": "IT"
   *           },
   *           {
   *            "job_id": 2,
   *            "job_address": "456 Elm St",
   *            "job_title": "Data Analyst",
   *            "salary": "7000",
   *            "user_id": 2,
   *            "job_description": "We are looking for a data analyst",
   *            "deadline_date": "2021-01-01T00:00:00.000Z",
   *            "field": "IT"
   *           }
   *         ]
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "No jobs found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/:field', fetchJobsByField);
jobRoute
  /**
   * @api {get} /calculate/:id Calculate percentage
   * @apiName CalculatePercentage
   * @apiGroup Jobs
   * @apiPermission authenticated user
   * @apiDescription Calculate percentage
   * @apiParam {Number} id Job ID
   * @apiSuccess {Object} percentage Percentage
   * @apiSuccess {Number} percentage.percentage Percentage
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "percentage": 50
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error calculating percentage"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/calculate/:id', authenticate, handleCalculatePercentage);
jobRoute
  /**
   * @api {delete} /admin/:id Remove job as admin
   * @apiName RemoveJobAsAdmin
   * @apiGroup Jobs
   * @apiPermission admin
   * @apiDescription Remove job as admin
   * @apiParam {Number} id Job ID
   * @apiSuccess {String} message Job removed
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Job deleted"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Job deletion failed"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 401 Unauthorized
   * {
   *  "message": "You do not have permission to delete jobs"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Job not found"
   * }
   *
   */
  .delete('/admin/:id', authenticate, removeJobAsAdmin);

export default jobRoute;
