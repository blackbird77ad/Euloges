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
    toggleLikeFeed,
    updateFeedViews,
    addCommentToFeed,
    getFeedComments,
    getFeedLikes,
    getFeedViewers
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

//global actions like, views, comment
feedRouter.patch("/view-feed", verifyToken, updateFeedViews);
feedRouter.patch("/toggle-like", verifyToken, toggleLikeFeed);
feedRouter.patch("/add-comment", verifyToken, addCommentToFeed);
feedRouter.get("/feed-likes/:feedId", verifyToken, getFeedLikes);
feedRouter.get("/feed-comments/:feedId", verifyToken, getFeedComments);
feedRouter.get("/feed-viewers/:feedId", verifyToken, getFeedViewers); 


//export router and use in index.mjs
export default feedRouter;

