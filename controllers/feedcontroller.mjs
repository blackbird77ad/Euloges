import {FeedModel} from "../models/feedmodel.mjs";
import {UserModel} from "../models/usermodel.mjs";
import {postFeedValidator, updateFeedValidator} from "../validators/feedvalidator.mjs";

// ADD feed || Post
export const postFeed = async (req, res, next) => {
    try {
        // Validate request
        const { error, value } = postFeedValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details[0].message });
        }

        // Ensure Cloudinary URL is correctly assigned
        const fileUrl = req.file?.path || req.file?.secure_url || null;

        // Save feed to Database
        const newPost = await FeedModel.create({
            ...value,
            user: req.auth.id,
            uploadUrl: fileUrl, // Ensure correct Cloudinary URL is saved
        });

        // Update the user's feed array to include this post
        await UserModel.findByIdAndUpdate(req.auth.id, {
            $push: { feed: newPost.id },
        });

        // Respond to user request
        res.status(201).json({
            message: "Your post has been created successfully.",
            post: newPost,
        });
    } catch (error) {
        // console.error("Error in postFeed:", error);// debug
        next(error);
    }
};



// GET feed||Post(s)
export const getFeeds = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit = 10, skip = 0, category } = req.query;

        // Parse the filters and sort parameters
        const userFilter = JSON.parse(filter);
        if (category) {
            userFilter.category = category;
        }

        // Fetch feeds from the database
        const userFeed = await FeedModel
            .find(userFilter)  // Apply user-defined filter
            .populate({
                path: 'user',  // Populate the user field in each post
                model: 'User',
                select: 'name profilePicture',  // Select only necessary fields from User
            })
            .sort(JSON.parse(sort))  // Apply custom sorting, such as sorting by most recent
            .limit(parseInt(limit))  // Limit the number of results
            .skip(parseInt(skip));  // Skip for pagination

        // Response to the request with populated user data in the posts
        return res.status(200).json(userFeed);
    } catch (error) {
        next(error);
    }
};



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
        // Check if an ID was provided in the route parameters
        if (!req.params.id) {
            return res.status(400).json({ error: "Feed ID is required" });
        }

        // Fetch the feed that matches the given ID and belongs to the authenticated user
        const feed = await FeedModel.findOne({ _id: req.params.id, user: req.auth.id });

        // If no feed is found, respond with a 404 error
        if (!feed) {
            return res.status(404).json({ error: "Feed not found" });
        }

        // Respond with the found feed
        return res.status(200).json({ feed });
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};



//UPDATE feed||post
export const updateFeed = async (req, res, next) => {
    try {
        // Validate incoming request
        const { error } = updateFeedValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details[0].message });
        }

        // Update the feed if it belongs to the authenticated user
        const updatedFeed = await FeedModel.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.id }, // Find post by ID & authenticated user
            {
                ...req.body, // Update other fields
                uploadUrl: req.file ? req.file.path : null,
            },
            { new: true } // Return updated document
        );

        // If feed is not found, return an error
        if (!updatedFeed) {
            return res.status(404).json({ error: "Feed not found or unauthorized to update" });
        }

        // Respond with the updated feed
        res.status(200).json({ updatedFeed });
    } catch (error) {
        next(error);
    }
};



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
