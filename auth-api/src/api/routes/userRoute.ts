import express from 'express';
import {addUser, getAllUsers, getCandidateUser, getCandidates, getUserById, getUserByToken, removeUser, removeUserAsAdmin, updateUser} from '../controllers/userController';
import {body} from 'express-validator';
import {authenticate} from '../../middlewares';

const userRoute = express.Router();

userRoute.get('/', getAllUsers);
userRoute.get('/candidates', authenticate, getCandidates);
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
)


userRoute.get('/:id', getUserById);

userRoute.put('/', authenticate, updateUser);

userRoute.delete('/', authenticate, removeUser);
userRoute.delete('/admin/:id', authenticate, removeUserAsAdmin);

export default userRoute;
