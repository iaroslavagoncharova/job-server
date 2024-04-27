import express from 'express';
import {
  addMatch,
  getAllMatches,
  getUserMatches,
  removeMatch,
} from '../controllers/matchController';
import {authenticate} from '../../middlewares';

const matchRoute = express.Router();

matchRoute
  .route('/')
  /**
   * @api {get} /matches Get all matches
   * @apiName GetMatches
   * @apiGroup Matches
   * @apiPermission all
   * @apiDescription Get all matches
   * @apiSuccess {Object[]} matches List of matches
   * @apiSuccess {Number} matches.match_id Match ID
   * @apiSuccess {Number} matches.user1_id User 1 ID
   * @apiSuccess {Number} matches.user2_id User 2 ID
   * @apiSuccess {Date} matches.created_at Match created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "matches": [
   *              {
   *               "match_id": 1,
   *               "user1_id": 1,
   *               "user2_id": 2,
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *              },
   *              {
   *               "match_id": 2,
   *               "user1_id": 2,
   *               "user2_id": 3,
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *              },
   *              {
   *               "match_id": 3,
   *               "user1_id": 3,
   *               "user2_id": 1,
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *              }
   *           ]
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No matches found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Error message"
   * }
   */
  .get(getAllMatches)
  /**
   * @api {post} /matches Add match
   * @apiName AddMatch
   * @apiGroup Matches
   * @apiPermission user
   * @apiDescription Add match
   * @apiParam  {Number} user2_id User 2 ID
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Match created"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Match not created"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Internal server error"
   * }
   *
   */
  .post(authenticate, addMatch);
matchRoute
  .route('/:id')
  /**
   * @api {delete} /matches/:id Remove match
   * @apiName RemoveMatch
   * @apiGroup Matches
   * @apiPermission user
   * @apiDescription Remove match
   * @apiParam  {Number} id Match ID
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": "Match removed"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Match not deleted"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Internal server error"
   * }
   */
  .delete(removeMatch);
matchRoute
  .route('/user')
  /**
   * @api {get} /matches/user Get user matches
   * @apiName GetUserMatches
   * @apiGroup Matches
   * @apiPermission user
   * @apiDescription Get user matches
   * @apiSuccess {Object[]} matches List of matches
   * @apiSuccess {Number} matches.match_id Match ID
   * @apiSuccess {Number} matches.user1_id User 1 ID
   * @apiSuccess {Number} matches.user2_id User 2 ID
   * @apiSuccess {Date} matches.created_at Match created at
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "matches": [
   *              {
   *               "match_id": 1,
   *               "user1_id": 1,
   *               "user2_id": 2,
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *              },
   *              {
   *               "match_id": 2,
   *               "user1_id": 2,
   *               "user2_id": 3,
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *             }
   *          ]
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "error": "No matches found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Internal server error"
   * }
   *
   */
  .get(authenticate, getUserMatches);

export default matchRoute;
