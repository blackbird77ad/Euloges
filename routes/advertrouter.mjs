import {Router} from "express";
import {verifyToken} from "../middlewares/auth.mjs";
import {getAdverts, updateAdvert, deleteAdvert, postAdvert} from '../controllers/advertcontroller.mjs';

const advertRouter = Router();

advertRouter.post('/advert', verifyToken, postAdvert);  // Admin only
advertRouter.get('/ads', verifyToken, getAdverts);     // All roles can view
advertRouter.patch('/ads/:id', verifyToken, updateAdvert); // Admin only
advertRouter.delete('/ads/:id', verifyToken, deleteAdvert); // Admin only

export default advertRouter;