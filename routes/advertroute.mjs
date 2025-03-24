import {Router} from "express";
import { verifyToken } from '../middleware/verifyToken.mjs';
import {getAdverts, updateAdvert, deleteAdvert, postAdvert} from '../controllers/advertController.mjs';

const advertRouter = Router();

advertRouter.post('/ads', verifyToken, postAdvert);  // Admin only
advertRouter.get('/ads', verifyToken, getAdverts);     // All roles can view
advertRouter.patch('/ads/:id', verifyToken, updateAdvert); // Admin only
advertRouter.delete('/ads/:id', verifyToken, deleteAdvert); // Admin only

export default advertRouter;