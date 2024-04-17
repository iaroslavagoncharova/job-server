import express, {Request} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate} from '../../middlewares';

const upload = multer({dest: './uploads/'});
const router = express.Router();

router.route('/upload').post(authenticate, upload.single('file'), uploadFile);

router.route('/delete/:filename').delete(authenticate, deleteFile);

export default router;
