import {Router} from "express";
import {verifyToken} from "../middlewares/auth.mjs";
import {
    postFeed,
    getFeed,
    getFeeds,
    getUserFeed,
    countFeed,
    updateFeed,
    deleteFeed,
    viewFeed,
    toggleLike,
    addComment
} from "../controllers/feedcontroller.mjs";
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

//global actions
feedRouter.get("/feed/:Id/views", verifyToken, viewFeed);
feedRouter.patch("/feed/:Id/like", verifyToken, toggleLike);
feedRouter.patch("feef/:Id/comments", verifyToken, addComment);

//export router and use in index.mjs
export default feedRouter;

