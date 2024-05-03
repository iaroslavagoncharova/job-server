import express from 'express';
import {authenticate} from '../../middlewares';
import {
  handleAddTestToJob,
  handleDeleteJobFromTest,
  handleDeleteTest,
  handleGetAllTests,
  handleGetCandidatesTests,
  handleGetJobsByTest,
  handleGetGeneralTests,
  handleGetTestsByUser,
  handleGetTestsForJob,
  handlePostTest,
  handlePutTest,
  handleTakeTest,
  handleGetCountUserTestsOutOfJobTests,
  handleGetJobTestsCount,
} from '../controllers/testController';

const testRoute = express.Router();
testRoute
  /**
   * @api {get} /tests/all Get all tests
   * @apiName Get all tests
   * @apiGroup Tests
   * @apiDescription Get all tests
   * @apiPermission all
   * @apiSuccess {Object[]} tests List of tests
   * @apiSuccess {Number} tests.id Test id
   * @apiSuccess {String} tests.test_type Test type
   * @apiSuccess {Number} tests.user_id User id (owner of the test or NULL if it's a general test)
   * @apiSuccess {String} tests.test_link Test link
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "test_id": 1,
   *   "test_type": "Javascript",
   *   "user_id": 1,
   *   "test_link": "https://www.test.com"
   *  },
   *  {
   *   "test_id": 2,
   *   "test_type": "Kommunikaatio",
   *   "user_id": NULL,
   *   "test_link": "https://www.test.com"
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Tests not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting tests"
   * }
   *
   */
  .get('/all', handleGetAllTests);
testRoute
  .route('/')
  /**
   * @api {get} /tests Get general tests
   * @apiName Get general tests
   * @apiGroup Tests
   * @apiDescription Get general tests (tests without user_id)
   * @apiGroup Tests
   * @apiPermission all
   * @apiSuccess {Object[]} tests List of tests
   * @apiSuccess {Number} tests.id Test id
   * @apiSuccess {String} tests.test_type Test type
   * @apiSuccess {Number} tests.user_id User id (NULL in this case)
   * @apiSuccess {String} tests.test_link Test link
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "test_id": 2,
   *   "test_type": "Kommunikaatio",
   *   "user_id": NULL,
   *   "test_link": "https://www.test.com"
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Tests not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting tests"
   * }
   */
  .get(handleGetGeneralTests)
  /**
   * @api {post} /tests Post test
   * @apiName Post test
   * @apiGroup Tests
   * @apiDescription Post a test
   * @apiPermission user
   * @apiParam {String} test_type Test type
   * @apiParam {String} test_link Test link
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Test posted"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error posting test"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Error posting test"
   * }
   *
   */
  .post(authenticate, handlePostTest);
testRoute
  /**
   * @api {get} /tests/byuser Get tests by user
   * @apiName Get tests by user
   * @apiGroup Tests
   * @apiDescription Get tests by user
   * @apiPermission user
   * @apiSuccess {Object[]} tests List of tests
   * @apiSuccess {Number} tests.id Test id
   * @apiSuccess {String} tests.test_type Test type
   * @apiSuccess {Number} tests.user_id User id
   * @apiSuccess {String} tests.test_link Test link
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "test_id": 1,
   *   "test_type": "Javascript",
   *   "user_id": 1,
   *   "test_link": "https://www.test.com"
   *  },
   *  {
   *   "test_id": 2,
   *   "test_type": "Kommunikaatio",
   *   "user_id": 1,
   *   "test_link": "https://www.test.com"
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Tests not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting tests"
   * }
   */
  .get('/byuser', authenticate, handleGetTestsByUser);
testRoute
  /**
   * @api {get} /tests/candidate Get candidate tests
   * @apiName Get candidate tests
   * @apiGroup Tests
   * @apiDescription Get candidate tests
   * @apiPermission user
   * @apiSuccess {Object[]} userTests List of tests
   * @apiSuccess {Number} userTests.test_id Test id
   * @apiSuccess {String} userTests.user_id User id
   * @apiSuccess {String} userTests.created_at Test created at
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "test_id": 1,
   *   "user_id": 1,
   *   "created_at": "2021-01-01T00:00:00.000Z"
   *  },
   *  {
   *   "test_id": 2,
   *   "user_id": 1,
   *   "created_at": "2021-01-01T00:00:00.000Z"
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Tests not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting tests"
   * }
   *
   */
  .get('/candidate', authenticate, handleGetCandidatesTests);
testRoute
  .route('/:id')
  /**
   * @api {put} /tests/:id Update test
   * @apiName Update test
   * @apiGroup Tests
   * @apiDescription Update a test
   * @apiPermission test owner
   * @apiParam {Number} id Test id
   * @apiParam {String} test_type Test type
   * @apiParam {String} test_link Test link
   * @apiSuccess {Object[]} testResponse Message and updated test object
   * @apiSuccess {String} testResponse.message Message
   * @apiSuccess {Object} testResponse.test Updated test object
   * @apiSuccess {Number} testResponse.test_id Test id
   * @apiSuccess {String} testResponse.test_type Test type
   * @apiSuccess {Number} testResponse.user_id User id
   * @apiSuccess {String} testResponse.test_link Test link
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Test updated",
   *  "test": {
   *           "test_id": 1,
   *           "test_type": "Javascript",
   *           "user_id": 1,
   *           "test_link": "https://www.test.com"
   *          }
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error updating test"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .put(authenticate, handlePutTest)
  /**
   * @api {delete} /tests/:id Delete test
   * @apiName Delete test
   * @apiGroup Tests
   * @apiDescription Delete a test
   * @apiPermission test owner
   * @apiParam {Number} id Test id
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Test deleted"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error deleting test"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .delete(authenticate, handleDeleteTest);
testRoute
  .route('/job/:id')
  /**
   * @api {get} /tests/job/:id Get tests for job
   * @apiName Get tests for job
   * @apiGroup Tests
   * @apiDescription Get tests for job
   * @apiPermission user
   * @apiParam {Number} id Job id
   * @apiSuccess {Object[]} jobTests List of test ids for the job
   * @apiSuccess {Number} jobTests.test_id Test id
   * @apiSuccess {Number} jobTests.job_id Job id
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "test_id": 1,
   *   "job_id": 1
   *  },
   *  {
   *   "test_id": 2,
   *   "job_id": 1
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Tests not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting tests"
   * }
   *
   */
  .get(authenticate, handleGetTestsForJob)
  /**
   * @api {post} /tests/job/:id Add test to job
   * @apiName Add test to job
   * @apiGroup Tests
   * @apiDescription Add a test to a job
   * @apiPermission job owner
   * @apiParam {Number} id Test id
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Test added to job"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error adding test to job"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .post(authenticate, handleAddTestToJob);
testRoute
  .route('/test/:id')
  /**
   * @api {get} /tests/test/:id Get jobs by test
   * @apiName Get jobs by test
   * @apiGroup Tests
   * @apiDescription Get jobs by test
   * @apiPermission job owner
   * @apiParam {Number} id Test id
   * @apiSuccess {Object[]} jobs List of jobs
   * @apiSuccess {Number} jobs.job_id Job id
   * @apiSuccess {String} jobs.job_address Job address
   * @apiSuccess {String} jobs.job_title Job title
   * @apiSuccess {String} jobs.salary Job salary
   * @apiSuccess {Number} jobs.user_id User id
   * @apiSuccess {String} jobs.job_description Job description
   * @apiSuccess {Date} jobs.deadline_date Job deadline date
   * @apiSuccess {String} jobs.field Job field
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * [
   *  {
   *   "job_id": 1,
   *   "job_address": "New York",
   *   "job_title": "Software Developer",
   *   "salary": "5000",
   *   "user_id": 1,
   *   "job_description": "We're looking for a software developer",
   *   "deadline_date": "2021-01-01T00:00:00.000Z",
   *   "field": "IT"
   *  },
   *  {
   *   "job_id": 2,
   *   "job_address": "London",
   *   "job_title": "Barista",
   *   "salary": "2000",
   *   "user_id": 1,
   *   "job_description": "We're looking for a barista",
   *   "deadline_date": "2021-01-01T00:00:00.000Z",
   *   "field": "Service"
   *  }
   * ]
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Jobs not found"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error getting jobs"
   * }
   */
  .get(authenticate, handleGetJobsByTest)
  /**
   * @api {delete} /tests/test/:id Delete job from test
   * @apiName Delete job from test
   * @apiGroup Tests
   * @apiDescription Delete a job from a test
   * @apiPermission job owner
   * @apiParam {Number} id Job id
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Job deleted from test"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error deleting job from test"
   * }
   */
  .delete(authenticate, handleDeleteJobFromTest);
testRoute
  /**
   * @api {post} /tests/take/test/:id Take test
   * @apiName Take test
   * @apiGroup Tests
   * @apiDescription Take a test
   * @apiPermission candidate user
   * @apiParam {Number} user_id User id
   * @apiParam {Number} id Test id
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Test taken"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Error taking test"
   * }
   * @apiErrorExample {json} Error-Response:
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .post('/take/test/:id', authenticate, handleTakeTest);

testRoute.get(
  '/count/:job_id/user',
  authenticate,
  handleGetCountUserTestsOutOfJobTests
);
testRoute.get('/count/:job_id', handleGetJobTestsCount);
export default testRoute;
