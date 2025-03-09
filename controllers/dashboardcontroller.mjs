import {DashboardModel} from "../models/dashboardmodel.mjs";
import {UserModel} from "../models/usermodel.mjs";

//User: Bereaved dashboard
export const getUserDashboard = async (req, res, next) => {
    try {
        const userId = req.auth._id;// Store user id in the req

        const user = await UserModel.findById(userId).populate("dashboard");

        // If  not a user with dashboard or login||auth
        if (!user || !user.dashboard) {
            return res.status(402).json({message: "No user Dashboard Found"});
        }
        //respond to request|| redirect user after signin
        res.status(200).json({user});
    }
    catch (error) {
        next(error);
    }
};

//User: Admin dashboard
export const getAdminDashboard = async (req, res, next) => {
    try {
        const adminId = req.auth._id;
        const adminDashboard = await DashboardModel.findOne({
            user: adminId});

        if (!adminDashboard) {
            return res.status(402).json({message: "No admin Dashboard Found"})
        }
        res.status(200).json({adminDashboard});
    }
    catch (error) {
next(error);
    }
}


