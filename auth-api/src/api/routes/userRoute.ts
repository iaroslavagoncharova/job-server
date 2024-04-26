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
userRoute
  /**
   * @api {get} /api/v1/users/candidate/:id Get a candidate
   * @apiName GetCandidate
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiParam {Number} id Candidate id
   * @apiSuccess {String} user_id User id
   * @apiSuccess {String} username User username
   * @apiSuccess {String} about_me User about_me
   * @apiSuccess {String} link User link
   * @apiSuccess {String} field User field
   * @apiSuccess {Object[]} skills User skills
   * @apiSuccess {String} skills.skill_name Skill name
   * @apiSuccess {Object[]} education User education
   * @apiSuccess {String} education.education_id Education id
   * @apiSuccess {String} education.user_id User id
   * @apiSuccess {String} education.school School
   * @apiSuccess {String} education.degree Degree
   * @apiSuccess {String} education.field Field
   * @apiSuccess {String} education.graduation Graduation date
   * @apiSuccess {Object[]} experience User experience
   * @apiSuccess {String} experience.experience_id Experience id
   * @apiSuccess {String} experience.user_id User id
   * @apiSuccess {String} experience.job_title Job title
   * @apiSuccess {String} experience.job_place Job place
   * @apiSuccess {String} experience.job_city Job city
   * @apiSuccess {String} experience.description Description
   * @apiSuccess {String} experience.start_date Start date
   * @apiSuccess {String} experience.end_date End date
   * @apiSuccess {Object[]} attachments User attachments
   * @apiSuccess {String} attachments.attachment_id Attachment id
   * @apiSuccess {String} attachments.attachment_name Attachment name
   * @apiSuccess {String} attachments.filename Filename
   * @apiSuccess {String} attachments.filesize Filesize
   * @apiSuccess {String} attachments.media_type Media type
   * @apiSuccess {String} attachments.user_id User id
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "user_id": "1",
   *  "username": "johndoe",
   *  "about_me": "I am a software developer",
   *  "link": "https://www.linkedin.com/in/johndoe",
   *  "field": "IT",
   *  "skills": [
   *             {
   *              "skill_name": "JavaScript",
   *             },
   *             {
   *              "skill_name": "Python",
   *              }
   *         ],
   *  "education": [
   *                {
   *                 "education_id": "1",
   *                 "user_id": "1",
   *                 "school": "University of Lagos",
   *                 "degree": "BSc",
   *                 "field": "Computer Science",
   *                 "graduation": "2020-01-01T00:00:00.000Z",
   *                }
   *              ],
   *  "experience": [
   *                {
   *                 "experience_id": "1",
   *                 "user_id": "1",
   *                 "job_title": "Software Developer",
   *                 "job_place": "Google",
   *                 "job_city": "California",
   *                 "description": "Develop software applications",
   *                 "start_date": "2020-01-01T00:00:00.000Z",
   *                 "end_date": "2021-01-01T00:00:00.000Z",
   *               }
   *              ],
   *  "attachments": [
   *                  {
   *                   "attachment_id": "1",
   *                   "attachment_name": "Resume",
   *                   "filename": "resume.pdf",
   *                   "filesize": "1024",
   *                   "media_type": "application/pdf",
   *                   "user_id": "1",
   *                  }
   *                ]
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "Candidate not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   *
   */
  .get('/candidate/:id', getCandidateUser);

userRoute
  /**
   * @api {get} /api/v1/users/token Get a user by token
   * @apiName GetUserByToken
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess user
   * @apiSuccess {String} user_id User id
   * @apiSuccess {String} username User username
   * @apiSuccess {String} email User email
   * @apiSuccess {String} user_level_id User level id
   * @apiSuccess {String} fullname User fullname
   * @apiSuccess {String} phone User phone
   * @apiSuccess {String} about_me User about_me
   * @apiSuccess {String} status User status
   * @apiSuccess {String} user_type User user_type
   * @apiSuccess {String} link User link
   * @apiSuccess {String} field User field
   * @apiSuccess {String} created_at User created_at
   * @apiSuccess {String} address User address
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "user_id": "1",
   *  "username": "johndoe",
   *  "email": "johndoe@example.com",
   *  "user_level_id": "1",
   *  "fullname": "John Doe",
   *  "phone": "08012345678",
   *  "about_me": "I am a software developer",
   *  "status": "active",
   *  "user_type": "candidate",
   *  "link": "https://www.linkedin.com/in/johndoe",
   *  "field": "IT",
   *  "created_at": "2021-01-01T00:00:00.000Z",
   *  "address": "New York",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "User not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/token', authenticate, getUserByToken);

userRoute
  /**
   * @api {post} /api/v1/users Add a user
   * @apiName AddUser
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess all
   * @apiParam {String} fullname User fullname
   * @apiParam {String} password User password
   * @apiParam {String} email User email
   * @apiParam {String} user_type User user_type
   * @apiParam {String} phone User phone
   * @apiSuccess {String} message User created
   * @apiSuccess {String} user_id User id
   * @apiSuccess {String} username User username
   * @apiSuccess {String} email User email
   * @apiSuccess {String} user_level_id User level id
   * @apiSuccess {String} fullname User fullname
   * @apiSuccess {String} phone User phone
   * @apiSuccess {String} about_me User about_me
   * @apiSuccess {String} status User status
   * @apiSuccess {String} user_type User user_type
   * @apiSuccess {String} link User link
   * @apiSuccess {String} field User field
   * @apiSuccess {String} created_at User created_at
   * @apiSuccess {String} address User address
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "user_id": "1",
   *  "username": "johndoe",
   *  "email": "johndoe@example.com",
   *  "user_level_id": "1",
   *  "fullname": "John Doe",
   *  "phone": "08012345678",
   *  "about_me": "I am a software developer",
   *  "status": "active",
   *  "user_type": "candidate",
   *  "link": "https://www.linkedin.com/in/johndoe",
   *  "field": "IT",
   *  "created_at": "2021-01-01T00:00:00.000Z",
   *  "address": "New York",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 400 Bad Request
   * {
   *  "message": "Invalid input"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .post(
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

userRoute
  /**
   * @api {get} /api/v1/users/:id Get a user
   * @apiName GetUser
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess all
   * @apiParam {Number} id User id
   * @apiSuccess {String} user_id User id
   * @apiSuccess {String} username User username
   * @apiSuccess {String} email User email
   * @apiSuccess {String} user_level_id User level id
   * @apiSuccess {String} fullname User fullname
   * @apiSuccess {String} phone User phone
   * @apiSuccess {String} about_me User about_me
   * @apiSuccess {String} status User status
   * @apiSuccess {String} user_type User user_type
   * @apiSuccess {String} link User link
   * @apiSuccess {String} field User field
   * @apiSuccess {String} created_at User created_at
   * @apiSuccess {String} address User address
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "user_id": "1",
   *  "username": "johndoe",
   *  "email": "johndoe@example.com",
   *  "user_level_id": "1",
   *  "fullname": "John Doe",
   *  "phone": "08012345678",
   *  "about_me": "I am a software developer",
   *  "status": "active",
   *  "user_type": "candidate",
   *  "link": "https://www.linkedin.com/in/johndoe",
   *  "field": "IT",
   *  "created_at": "2021-01-01T00:00:00.000Z",
   *  "address": "New York",
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "User not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .get('/:id', getUserById);

userRoute
  /**
   * @api {put} /api/v1/users Update a user
   * @apiName UpdateUser
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess user
   * @apiParam {String} [email] User email
   * @apiParam {String} [fullname] User fullname
   * @apiParam {String} [username] User username
   * @apiParam {String} [field] User field
   * @apiParam {String} [phone] User phone
   * @apiParam {String} [password] User password
   * @apiParam {String} [address] User address
   * @apiParam {String} [about_me] User about_me
   * @apiParam {String} [status] User status
   * @apiSuccess {String} message User updated
   * @apiSuccess {String} user_id User id
   * @apiSuccess {String} username User username
   * @apiSuccess {String} email User email
   * @apiSuccess {String} user_level_id User level id
   * @apiSuccess {String} fullname User fullname
   * @apiSuccess {String} phone User phone
   * @apiSuccess {String} about_me User about_me
   * @apiSuccess {String} status User status
   * @apiSuccess {String} user_type User user_type
   * @apiSuccess {String} link User link
   * @apiSuccess {String} field User field
   * @apiSuccess {String} created_at User created_at
   * @apiSuccess {String} address User address
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": 'User updated',
   *  "user": {
   *  "user_id": "1",
   *  "username": "johndoe",
   *  "email": "johndoe@example.com",
   *  "user_level_id": "1",
   *  "fullname": "John Doe",
   *  "phone": "08012345678",
   *  "about_me": "I am a software developer",
   *  "status": "active",
   *  "user_type": "candidate",
   *  "link": "https://www.linkedin.com/in/johndoe",
   *  "field": "IT",
   *  "created_at": "2021-01-01T00:00:00.000Z",
   *  "address": "New York",
   * }
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "User not updated"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .put('/', authenticate, updateUser);

userRoute
  /**
   * @api {delete} /api/v1/users/:id Delete a user
   * @apiName DeleteUser
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess user
   * @apiParam {Number} id User id
   * @apiSuccess {String} message User deleted
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "User deleted"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "User not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .delete('/', authenticate, removeUser);
userRoute
  /**
   * @api {delete} /api/v1/users/admin/:id Delete a user as admin
   * @apiName DeleteUserAsAdmin
   * @apiGroup Users
   * @apiVersion 1.0.0
   * @apiAccess admin
   * @apiParam {Number} id User id
   * @apiSuccess {String} message User deleted
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *  "message": "User deleted"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 404 Not Found
   * {
   *  "message": "User not found"
   * }
   * @apiErrorExample {json} List error
   * HTTP/1.1 500 Internal Server Error
   * {
   *  "message": "Internal server error"
   * }
   */
  .delete('/admin/:id', authenticate, removeUserAsAdmin);

export default userRoute;
