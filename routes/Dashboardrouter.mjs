import {Router} from 'express';
import {verifyToken} from "../middlewares/auth.mjs";
import {getUserDashboard, getAdminDashboard} from "../controllers/dashboardcontroller.mjs";

const  dashboardRouter = Router();

dashboardRouter.get('/bereaved-dashboard/', verifyToken, getUserDashboard);
dashboardRouter.get('/admin-dashboard', verifyToken, getAdminDashboard);

export default dashboardRouter;
