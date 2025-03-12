import {DashboardModel} from "../models/dashboardmodel.mjs";
import {UserModel} from "../models/usermodel.mjs";

//User: Bereaved dashboard
export const getUserDashboard = async (req, res, next) => {
    try {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ message: "Unauthorized: Login or Sign-in to view dashboard" });
        }

        const userId = req.auth.id;

        const user = await UserModel.findById(userId).populate("dashboard");

        if (!user || !user.dashboard) {
            return res.status(404).json({ message: "No user Dashboard Found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};


//User: Admin dashboard
export const getAdminDashboard = async (req, res, next) => {
    try {
        const adminId = req.auth.id;

        const adminDashboard = await DashboardModel.findOne({
            user: adminId});

        if (!adminDashboard) {
            return res.status(404).json({message: "No admin Dashboard Found"})
        }
        res.status(200).json({adminDashboard});
    }
    catch (error) {
next(error);
    }
}


