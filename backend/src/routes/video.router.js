import express from 'express';
import verifyJWT from '../middlewares/auth.middlewares.js';

import upload from  '../middlewares/middlewares.js'

import {
  changeTitle,
  changeDescription,
  changeTags,
  updateLikes,
  updateViews,
  uploadVideo,
  updateDislikes,
  upadateComment,     

} from '../controllers/video.controllers.js';


const videoRouter = express.Router();

videoRouter.post('/uploadVideo', upload.fields([{ name: 'uploadVideo', maxCount: 1 }]), verifyJWT, uploadVideo);

videoRouter.patch('/title', changeTitle);

videoRouter.patch('/description', verifyJWT, changeDescription);

videoRouter.patch('/tags', changeTags);

videoRouter.patch('/likes', updateLikes);

videoRouter.patch('/views', verifyJWT, updateViews);

videoRouter.patch('/dislikes', verifyJWT, updateDislikes);

export default videoRouter;
