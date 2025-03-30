// External Package imports
import { Router } from 'express';
//cloudinary storage
import {
    uploadProfilePicture,
    uploadProfileAndCoverMiddleware,
} from "../config/cloudinary.mjs";

// Internal variables imports
import {
    userSignup,
    userSignIn,
    userLogOut,
    getUser,
    getUserById,
    getAllUsers,
    updateProfile,
    deleteProfile,
    followUser,       // Import followUser function
    unfollowUser      // Import unfollowUser function
} from "../controllers/usercontroller.mjs";


import { verifyToken } from '../middlewares/auth.mjs';

const userRouter = Router();

// User authentication routes
userRouter.post('/signup',uploadProfileAndCoverMiddleware, userSignup); // Test Successful
userRouter.post('/login',  userSignIn); // Test Successful
userRouter.post('/logout', userLogOut); // Test Successful

// User profile routes
// Get logged-in user profile
userRouter.get('/getUser', verifyToken, getUser); // Test Successful
// Get another user's profile by ID
userRouter.get("/getUser/:id", verifyToken, getUserById);
// Get all users with optional filtering
userRouter.get("/getUsers", verifyToken, getAllUsers);
//Patch and delete
userRouter.patch(
    "/updateUser/:id",
    verifyToken,
    uploadProfileAndCoverMiddleware, // cover photo and profile picture
    updateProfile
); // Test Successful
userRouter.delete('/deleteUser/:id', verifyToken, deleteProfile); // Test Successful

// Follow/Unfollow routes
userRouter.patch('/follow', verifyToken, followUser); // Follow a user
userRouter.patch('/unfollow', verifyToken, unfollowUser); // Unfollow a user

export default userRouter;