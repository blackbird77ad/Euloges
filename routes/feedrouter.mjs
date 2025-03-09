import {Router} from "express";
import {verifyToken} from "../middlewares/auth.mjs";
import {
    postFeed,
    getFeed,
    getFeeds,
    countFeed,
    updateFeed,
    deleteFeed} from "../controllers/feedcontroller.mjs";

const feedRouter = Router();

//Define routes for feeds
feedRouter.post("/add-post", verifyToken, postFeed);
feedRouter.get("/get-post", verifyToken, getFeed);
feedRouter.get("/get-posts", verifyToken, getFeeds);
feedRouter.patch("/update-post", verifyToken, updateFeed);
feedRouter.delete("/delete-post", verifyToken, deleteFeed);
feedRouter.get("/count-post", verifyToken, countFeed);


//export router and use in index.mjs
export default feedRouter;

