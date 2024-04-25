import express from 'express';
import {
  addUser,
  getAllUsers,
  getCandidateUser,
  getCandidates,
  getUserById,
  getUserByToken,
  removeUser,
  removeUserAsAdmin,
  updateUser,
} from '../controllers/userController';
import {body} from 'express-validator';
import {authenticate} from '../../middlewares';

const userRoute = express.Router();

userRoute
  /**
   * @api {get} /api/v1/users Get all users
   * @apiName GetAllUsers
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiSuccess {Object[]} users List of users
   * @apiSuccess {String} users._id User id
   * @apiSuccess {String} users.username User username
   * @apiSuccess {String} users.fullname User fullname
   * @apiSuccess {String} users.email User email
   * @apiSuccess {String} users.user_level_id User level id
   * @apiSuccess {String} users.phone User phone
   * @apiSuccess {String} users.about_me User about_me
   * @apiSuccess {String} users.status User status
   * @apiSuccess {String} users.user_type User user_type
   * @apiSuccess {String} users.link User link
   * @apiSuccess {String} users.field User field
   * @apiSuccess {String} users.created_at User created_at
   * @apiSuccess {String} users.address User address
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "users": [
   *             {
   *               "user_id": "1",
   *               "username": "johndoe",
   *               "fullname": "John Doe",
   *               "email": "johndoe@example.com",
   *               "user_level_id": "1",
   *               "phone": "08012345678",
   *               "about_me": "I am a software developer",
   *               "status": "active",
   *               "user_type": "candidate",
   *               "link": "https://www.linkedin.com/in/johndoe",
   *               "field": "IT",
   *               "created_at": "2021-01-01T00:00:00.000Z",
   *               "address": "New York",
   *             },
   *            {
   *              "user_id": "2",
   *             "username": "janedoe",
   *             "fullname": "Jane Doe",
   *             "email": "janedoe@example.com",
   *             "user_level_id": "1",
   *             "phone": "08012345678",
   *             "about_me": "I am a software developer",
   *             "status": "active",
   *             "user_type": "candidate",
   *             "link": "https://www.linkedin.com/in/janedoe",
   *             "field": "IT",
   *             "created_at": "2021-01-01T00:00:00.000Z",
   *             "address": "New York",
   *          }
   *      ]
   * }
   *
   *
   *
   */
  .get('/', getAllUsers);
userRoute
  /**
 * @api {get} /api/v1/users/candidates Get all candidates
 * @apiName GetCandidates
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiSuccess {Object[]} users List of users as candidates
//  * SELECT Users.username, Users.email, Users.fullname, Users.phone, Users.about_me, Users.link, Users.field FROM Users WHERE user_id = ?',
 * @apiSuccess {String} users._id User id
  * @apiSuccess {String} users.username User username
  * @apiSuccess {String} users.fullname User fullname
  * @apiSuccess {String} users.email User email
  * @apiSuccess {String} users.phone User phone
  * @apiSuccess {String} users.about_me User about_me
  * @apiSuccess {String} users.link User link
  * @apiSuccess {String} users.field User field
  * @apiSuccessExample {json} Success
  * HTTP/1.1 200 OK
  * {
  *  "users": [
  *            {
  *             "user_id": "1",
  *             "username": "johndoe",
  *             "fullname": "John Doe",
  *             "email": "johndoe@example.com",
  *             "phone": "08012345678",
  *             "about_me": "I am a software developer",
  *             "link": "https://www.linkedin.com/in/johndoe",
  *             "field": "IT",
  *           },
  *           {
  *             "user_id": "2",
  *             "username": "janedoe",
  *             "fullname": "Jane Doe",
  *             "email": "janedoe@example.com",
  *             "phone": "08012345678",
  *             "about_me": "I am a software developer",
  *             "link": "https://www.linkedin.com/in/janedoe",
  *             "field": "IT",
  *         }
  *     ]
  * }
  *
  * @apiErrorExample {json} List error
  * HTTP/1.1 404 Not Found
  * {
  *  "message": "No candidates found"
  * }
 */
  .get('/candidates', authenticate, getCandidates);
userRoute.get('/candidate/:id', getCandidateUser);

userRoute.get('/token', authenticate, getUserByToken);

userRoute.post(
  '/',
  body('password')
    .isString()
    .notEmpty()
    .isLength({min: 8, max: 20})
    .isString()
    .escape()
    .trim(),
  body('email').isEmail().normalizeEmail().isString(),
  body('fullname').isString().notEmpty().isString().escape().trim(),
  body('user_type').isString().notEmpty().isString().escape().trim(),
  body('phone').isString().notEmpty().isString().escape().trim(),
  addUser
);

userRoute.get('/:id', getUserById);

userRoute.put('/', authenticate, updateUser);

userRoute.delete('/', authenticate, removeUser);
userRoute.delete('/admin/:id', authenticate, removeUserAsAdmin);

export default userRoute;
