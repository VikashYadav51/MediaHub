import express from 'express';
import verifyJWT from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/middlewares.js';

import {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
  updateProfilePicture,
  updateCoverPicture,
  upadateAvatar,
  updateEmailid,
  getProfile,
  refreshAccessToken,
} from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.post(
  '/register',
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
  ]),
  registerUser  
);

userRouter.post('/login', loginUser);

userRouter.post('/logout', verifyJWT, logoutUser);

userRouter.patch('/password', verifyJWT, updatePassword);

userRouter.patch('/profile-picture', verifyJWT, upload.single('profilePicture'), updateProfilePicture);

userRouter.patch('/cover-picture', verifyJWT, upload.single('coverPicture'), updateCoverPicture);

userRouter.patch('/avatar', verifyJWT, upload.single('avatar'), upadateAvatar);

userRouter.patch('/email', verifyJWT, updateEmailid);

userRouter.get('/profile', verifyJWT, getProfile);

userRouter.post('/refresh', refreshAccessToken);

export default userRouter;


