import express from 'express';
import {login} from '../controllers/authController';
import {body} from 'express-validator';

const authRoute = express.Router();

authRoute
  /**
   * @api {post} /auth/login Login
   * @apiName Login
   * @apiGroup Auth
   * @apiVersion  1.0.0
   * @apiPermission all
   * @apiParam  {String} email User email
   * @apiParam  {String} password User password
   * @apiSuccess {Object[]} message Message object
   * @apiSuccess {String} message.message Message
   * @apiSuccess {String} message.token JWT token
   * @apiSuccess {Object[]} user User object
   * @apiSuccess {String} user.user_id User ID
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.email User email
   * @apiSuccess {String} user.user_level_id User level ID
   * @apiSuccess {String} user.fullname User full name
   * @apiSuccess {String} user.phone User phone
   * @apiSuccess {String} user.user_type User type
   * @apiSuccess {String} user.about_me User about me
   * @apiSuccess {String} user.status User status
   * @apiSuccess {String} user.link User link
   * @apiSuccess {String} user.field User field
   * @apiSuccess {String} user.created_at User created at
   * @apiSuccess {String} user.address User address
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "message": {
   *              "message": "Logged in",
   *              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjEwYzQwZjYtZjQwZi00ZjQwLWE0ZjQtZjQwZjQwZjQwZjQwIiwiaWF0IjoxNjMwNjQwNjYyfQ.7",
   *              "user": {
   *                        "user_id": "1",
   *                        "username": "johndoe",
   *                        "email": "johndoe@example.com",
   *                        "user_level_id": "1",
   *                        "fullname": "John Doe",
   *                        "phone": "08012345678",
   *                        "about_me": "I am a software developer",
   *                        "status": "active",
   *                        "user_type": "candidate",
   *                        "link": "https://www.linkedin.com/in/johndoe",
   *                        "field": "IT",
   *                        "created_at": "2021-01-01T00:00:00.000Z",
   *                        "address": "New York",
   *                      },
   *           }
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 401 Unauthorized
   * {
   *   "error": "Invalid email or the user doesn't exist"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 401 Unauthorized
   * {
   *  "error": "Invalid password"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "JWT_SECRET not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "error": "Internal Server Error"
   * }
   */
  .post(
    '/login',
    body('email').isEmail().normalizeEmail().isString(),
    body('password').isLength({min: 8, max: 20}).isString().notEmpty(),
    login
  );

export default authRoute;
