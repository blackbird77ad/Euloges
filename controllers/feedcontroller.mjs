import {FeedModel} from "../models/feedmodel.mjs";
import {postFeedValidator, updateFeedValidator} from "../validators/feedvalidator.mjs";

//ADD feed||Post
export const postFeed  = async (req, res, next) => {
    //validate request
    try {
        const {error, value} = postFeedValidator.validate(req.body);
        if (error) {
            return res.status(422).json({error: error.details[0].message});
        }
        //save feed to Database
        const newPost = await FeedModel.create({
            ...value,
            user: req.auth.id,
        })
        //respond to user request
        res.status(201).json({
            message: 'Your post has been created successfully.',
            post: newPost
        })
    }
    catch (error) {
        next(error);
    }
}

//GET feed||Post(s)
export const getFeeds = async (req, res, next) => {
    try {
        const {filter = "{}", sort = "{}", limit = 10, skip = 0, category} = req.query;
        //filter
        const userFilter = JSON.parse(filter);
        if (category) {userFilter.category = category;}

        //fetch from database
        const userFeed = await FeedModel
            .find(JSON.parse(filter))
            .sort(JSON.parse(sort))
            .limit(parseInt(limit))// ensures the limit is an integer
            .skip(parseInt(skip))// ensures the skip is also an integer

        //Response to the request
        return res.status(200).json(userFeed)
    }// end of try, beginning of catch
    catch (error) {
        next(error);
    }
}

//Count feed||Post(S)
export const countFeed = async (req, res, next) => {
    try {
        const { filter = "{}" } = req.query;
        const userFilter = {...JSON.parse(filter), user: req.auth.id};
        //count feeds in db
        const userFeed = await FeedModel.countDocuments(userFilter);
        //respond to request
        res.status(200).json({userFeed});
    }
    catch (error) {
        next(error);
    }
}

//GET Feed||Post
export const getFeed = async (req, res, next) => {
    try {
        //retrieve a post from database
        const feed = await FeedModel.findById(req.params.id);
        //If no feed available available, respond to request
        if (!feed) {
            return res.status(422).json({error: feed.message});
        }
        //respond if there feed|| post by the user
        return res.status(200).json({feed});
    }
    catch (error) {
        next(error);
    }
}

//UPDATE feed||post
export const updateFeed = async (req, res, next) => {
    try {
        //validate incoming request from user
        const {error, value} = updateFeedValidator.validate(req.body);
        if (error) {
            return res.status(422).json({error: error.details[0].message});
        }
        const updatedFeed = await FeedModel.findByIdAndUpdate(
            {
                _id: req.params.id, user: req.auth.id
            },
            {...req.body },
            {new: true}
        );

        if (!updatedFeed) {
            return res.status(404).json("Nothing to update");
        }
        //respond to request
        res.status(201).json({updatedFeed})
    }
    catch (error) {
        next(error);
    }}


    //DELETE Feed||Post
    export const deleteFeed = async (req, res, next) => {
        try {
            const deletedFeed = await FeedModel.findOneAndDelete(req.body.id)
            //check if the feed exist ||user with Id exist
            if (!deletedFeed) {
                return res.status(422).json({error: deletedFeed.message});
            }
            res.status(200).json({'Post deleted': deletedFeed});
        }
        catch (error) {
            next(error);
        }
    }
