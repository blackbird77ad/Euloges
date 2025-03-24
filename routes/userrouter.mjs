// External Package imports
import { Router } from 'express';
import { profilePic } from '../middlewares/upload.mjs';

// Internal variables imports
import {
    userSignup,
    userSignIn,
    userLogOut,
    getUser,
    updateProfile,
    deleteProfile,
    followUser,       // Import followUser function
    unfollowUser      // Import unfollowUser function
} from '../controllers/userController.mjs';
import { verifyToken } from '../middlewares/auth.mjs';

const userRouter = Router();

// User authentication routes
userRouter.post('/signup', userSignup); // Test Successful
userRouter.post('/login', userSignIn); // Test Successful
userRouter.post('/logout', userLogOut); // Test Successful

// User profile routes
userRouter.get('/getUser', verifyToken, getUser); // Test Successful
userRouter.patch('/updateUser', verifyToken, profilePic.single('profilePicture'), updateProfile); // Test Successful
userRouter.delete('/deleteUser', verifyToken, deleteProfile); // Test Successful

// Follow/Unfollow routes
userRouter.patch('/follow', verifyToken, followUser); // Follow a user
userRouter.patch('/unfollow', verifyToken, unfollowUser); // Unfollow a user

export default userRouter;