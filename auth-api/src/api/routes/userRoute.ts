import express from 'express';
import {addUser, getAllUsers, getUserById, getUserByToken} from '../controllers/userController';
import {body} from 'express-validator';
import {authenticate} from '../../middlewares';

const userRoute = express.Router();

userRoute.get('/', getAllUsers);

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
)

userRoute.get('/:id', getUserById);

export default userRoute;
