//External Package imports
import  {Router} from 'express';

//Internal variables imports
import {
    userSignup,
    userSignIn,
    userLogOut,
    getUser,
    updateProfile,
    deleteProfile

} from "../controllers/usercontroller.mjs"
import {verifyToken} from "../middlewares/auth.mjs";

const userRouter = Router();

userRouter.post('/signup', userSignup); //Test Successful
userRouter.post('/login', userSignIn); //Test Successful
userRouter.post('/logout', userLogOut); //Test Successful
userRouter.get('/getUser', verifyToken, getUser);//Test Successful
userRouter.patch('/updateUser', verifyToken, updateProfile); //Test Successful
userRouter.delete('/deleteUser', verifyToken, deleteProfile); //Test Successful


export default userRouter;