import express, {Request} from 'express';
import {deleteFile, uploadFile} from '../controllers/uploadController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate} from '../../middlewares';

const upload = multer({dest: './uploads/'});
const router = express.Router();

router.route('/upload').post(authenticate, upload.single('file'), uploadFile);

router.route('/delete/:filename').delete(authenticate, deleteFile);

router.get('/download/:filename', (req: Request, res) => {
  const filename = req.params.filename;
  const filePath = `./uploads/${filename}`;
  res.download(filePath);
});

export default router;
