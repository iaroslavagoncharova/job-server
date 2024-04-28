import express from 'express';
import { authenticate } from '../../middlewares';
import {addSwipe, getAllSwipes, getSwipe, getSwipeById, getSwipesRight, getUserRightSwipes, getUserSwipes, removeSwipe} from '../controllers/swipesController';

const swipeRoute = express.Router();

swipeRoute.route('/')
/**
 * @api {get} /swipes Get all swipes
 * @apiName GetSwipes
 * @apiGroup Swipes
 * @apiDescription Get all swipes
 * @apiAccess all
 * @apiSuccess {Object[]} swipes Swipes array
 * @apiSuccess {Number} swipes.swipe_id Swipe id
 * @apiSuccess {Number} swipes.swiper_id Swiper id
 * @apiSuccess {Number} swipes.swiped_id Swiped id
 * @apiSuccess {String} swipes.swipe_direction Swipe direction
 * @apiSuccess {String} swipes.swipe_type Swipe type
 * @apiSuccess {Date} swipes.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "swipe_id": 1,
 *   "swiper_id": 1,
 *   "swiped_id": 2,
 *   "swipe_direction": "right",
 *   "swipe_type": "job",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "swipe_id": 2,
 *   "swiper_id": 1,
 *   "swiped_id": 3,
 *   "swipe_direction": "left",
 *   "swipe_type": "candidate",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(getAllSwipes)
/**
 * @api {post} /swipes Add a swipe
 * @apiName AddSwipe
 * @apiGroup Swipes
 * @apiDescription Add a swipe
 * @apiAccess user
 * @apiParam {Number} swiped_id Swiped id
 * @apiParam {String} swipe_direction Swipe direction
 * @apiParam {String} swipe_type Swipe type
 * @apiParamExample {json} Request-Example:
 * {
 *  "swiped_id": 2,
 *  "swipe_direction": "right",
 *  "swipe_type": "job"
 * }
 * @apiSuccess {String} message Success message
 * @apiSuccess {Object} swipe Swipe object
 * @apiSuccess {Number} swipe.swipe_id Swipe id
 * @apiSuccess {Number} swipe.swiper_id Swiper id
 * @apiSuccess {Number} swipe.swiped_id Swiped id
 * @apiSuccess {String} swipe.swipe_direction Swipe direction
 * @apiSuccess {String} swipe.swipe_type Swipe type
 * @apiSuccess {Date} swipe.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *  "message": "Swipe posted",
 *  "swipe": {
 *            "swipe_id": 1,
 *            "swiper_id": 1,
 *            "swiped_id": 2,
 *            "swipe_direction": "right",
 *            "swipe_type": "job",
 *            "swiped_at": "2021-08-02T00:00:00.000Z"
 *           }
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *  "message": "Swipe not added"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.post(authenticate, addSwipe);
swipeRoute.route('/:id')
/**
 * @api {get} /swipes/:id Get a swipe by id
 * @apiName GetSwipe
 * @apiGroup Swipes
 * @apiDescription Get a swipe by id
 * @apiAccess all
 * @apiParam {Number} id Swipe id
 * @apiSuccess {Object} swipe Swipe object
 * @apiSuccess {Number} swipe.swipe_id Swipe id
 * @apiSuccess {Number} swipe.swiper_id Swiper id
 * @apiSuccess {Number} swipe.swiped_id Swiped id
 * @apiSuccess {String} swipe.swipe_direction Swipe direction
 * @apiSuccess {String} swipe.swipe_type Swipe type
 * @apiSuccess {Date} swipe.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "swipe_id": 1,
 *  "swiper_id": 1,
 *  "swiped_id": 2,
 *  "swipe_direction": "right",
 *  "swipe_type": "job",
 *  "swiped_at": "2021-08-02T00:00:00.000Z"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipe found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(getSwipe)
/**
 * @api {delete} /swipes/:id Remove a swipe
 * @apiName RemoveSwipe
 * @apiGroup Swipes
 * @apiDescription Remove a swipe
 * @apiAccess user
 * @apiParam {Number} id Swipe id
 * @apiSuccess {String} message Success message
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 203 No Content
 * {
 *  "message": "Swipe removed"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.delete(removeSwipe);
swipeRoute.route('/user')
/**
 * @api {get} /swipes/user Get all swipes by user (using token)
 * @apiName GetUserSwipes
 * @apiGroup Swipes
 * @apiDescription Get all swipes by user (where user is the swiper)
 * @apiAccess user
 * @apiSuccess {Object[]} swipes Swipes array
 * @apiSuccess {Number} swipes.swipe_id Swipe id
 * @apiSuccess {Number} swipes.swiper_id Swiper id
 * @apiSuccess {Number} swipes.swiped_id Swiped id
 * @apiSuccess {String} swipes.swipe_direction Swipe direction
 * @apiSuccess {String} swipes.swipe_type Swipe type
 * @apiSuccess {Date} swipes.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "swipe_id": 1,
 *   "swiper_id": 1,
 *   "swiped_id": 2,
 *   "swipe_direction": "right",
 *   "swipe_type": "job",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "swipe_id": 2,
 *   "swiper_id": 1,
 *   "swiped_id": 3,
 *   "swipe_direction": "left",
 *   "swipe_type": "candidate",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(authenticate, getUserSwipes);
swipeRoute.route('/right')
/**
 * @api {get} /swipes/right Get all right swipes
 * @apiName GetSwipesRight
 * @apiGroup Swipes
 * @apiDescription Get all right swipes (no matter the type or user)
 * @apiAccess all
 * @apiSuccess {Object[]} swipes Swipes array
 * @apiSuccess {Number} swipes.swipe_id Swipe id
 * @apiSuccess {Number} swipes.swiper_id Swiper id
 * @apiSuccess {Number} swipes.swiped_id Swiped id
 * @apiSuccess {String} swipes.swipe_direction Swipe direction
 * @apiSuccess {String} swipes.swipe_type Swipe type
 * @apiSuccess {Date} swipes.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "swipe_id": 1,
 *   "swiper_id": 1,
 *   "swiped_id": 2,
 *   "swipe_direction": "right",
 *   "swipe_type": "job",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "swipe_id": 2,
 *   "swiper_id": 1,
 *   "swiped_id": 3,
 *   "swipe_direction": "right",
 *   "swipe_type": "candidate",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(getSwipesRight);
swipeRoute.route('/user/right')
/**
 * @api {get} /swipes/user/right Get all right swipes by user (using token)
 * @apiName GetUserRightSwipes
 * @apiGroup Swipes
 * @apiDescription Get all right swipes by user (where user is the swiper and has swiped right)
 * @apiAccess user
 * @apiSuccess {Object[]} swipes Swipes array
 * @apiSuccess {Number} swipes.swipe_id Swipe id
 * @apiSuccess {Number} swipes.swiper_id Swiper id
 * @apiSuccess {Number} swipes.swiped_id Swiped id
 * @apiSuccess {String} swipes.swipe_direction Swipe direction
 * @apiSuccess {String} swipes.swipe_type Swipe type
 * @apiSuccess {Date} swipes.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "swipe_id": 1,
 *   "swiper_id": 1,
 *   "swiped_id": 2,
 *   "swipe_direction": "right",
 *   "swipe_type": "job",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "swipe_id": 2,
 *   "swiper_id": 1,
 *   "swiped_id": 3,
 *   "swipe_direction": "right",
 *   "swipe_type": "candidate",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 */
.get(authenticate, getUserRightSwipes);
swipeRoute.route('/user/:id')
/**
 * @api {get} /swipes/user/:id Get all swipes for user id (without token)
 * @apiName GetUserSwipesById
 * @apiGroup Swipes
 * @apiDescription Get all swipes for user id (where user is either the swiper or the swiped)
 * @apiAccess user
 * @apiParam {Number} id User id
 * @apiSuccess {Object[]} swipes Swipes array
 * @apiSuccess {Number} swipes.swipe_id Swipe id
 * @apiSuccess {Number} swipes.swiper_id Swiper id
 * @apiSuccess {Number} swipes.swiped_id Swiped id
 * @apiSuccess {String} swipes.swipe_direction Swipe direction
 * @apiSuccess {String} swipes.swipe_type Swipe type
 * @apiSuccess {Date} swipes.swiped_at Swiped at
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "swipe_id": 1,
 *   "swiper_id": 1,
 *   "swiped_id": 2,
 *   "swipe_direction": "right",
 *   "swipe_type": "job",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  },
 *  {
 *   "swipe_id": 2,
 *   "swiper_id": 1,
 *   "swiped_id": 3,
 *   "swipe_direction": "left",
 *   "swipe_type": "candidate",
 *   "swiped_at": "2021-08-02T00:00:00.000Z"
 *  }
 * ]
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *  "message": "No swipes found"
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Internal server error"
 * }
 *
 */
.get(getSwipeById);

export default swipeRoute;
