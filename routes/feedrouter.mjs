import {Router} from "express";
import {verifyToken} from "../middlewares/auth.mjs";
import {
    postFeed,
    getFeed,
    getFeeds,
    getUserFeed,
    countFeed,
    updateFeed,
    deleteFeed} from "../controllers/feedcontroller.mjs";
import {uploadPost} from "../config/cloudinary.mjs";

const feedRouter = Router();

//Define routes for feeds
feedRouter.post("/add-post", verifyToken,uploadPost.single("uploadUrl"), postFeed);
feedRouter.get("/get-post/:id", verifyToken, getFeed);
feedRouter.get("/get-posts", verifyToken, getFeeds);
feedRouter.get("/get-user-feeds", verifyToken, getUserFeed );
feedRouter.patch("/update-post/:id", verifyToken, uploadPost.single("uploadUrl"), updateFeed);
feedRouter.delete("/delete-post/:id", verifyToken, deleteFeed);
feedRouter.get("/count-post", verifyToken, countFeed);


//export router and use in index.mjs
export default feedRouter;

