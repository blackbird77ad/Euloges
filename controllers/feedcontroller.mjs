import {FeedModel} from "../models/feedmodel.mjs";
import {UserModel} from "../models/usermodel.mjs";
import {postFeedValidator, updateFeedValidator} from "../validators/feedvalidator.mjs";

// ADD feed || Post
export const postFeed = async (req, res, next) => {
    try {

        //console.log("Request body:", req.body); // Check what's coming in the body
        //console.log("Uploaded file:", req.file); // Check the uploaded file info
        // Validate request
        const { error, value } = postFeedValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details[0].message });
        }
        // console.log("Uploaded File:", req.file);

        const fileUrl = req.file?.path || req.body.uploadUrl || "";
        // Ensure the correct URL is assigned

        // if (!fileUrl) {
        //     return res.status(400).json({ error: "File upload failed. No URL received from Cloudinary." });
        // }
        //console.log("File URL before saving to db:", fileUrl);

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
        // Re-fetch the post with populated user data
        const populatedPost = await FeedModel.findById(newPost._id).populate({
            path: 'user',
            model: 'User',
            select: 'name profilePicture dateOfBirth role followers following'
        });

        res.status(201).json({
            message: "Post created successfully.",
            post: populatedPost,
        });
    } catch (error) {
        next(error);
    }
};

//GetFeed
export const getUserFeed = async (req, res, next) => {
    try {
        const userId = req.auth.id;

        const feeds = await FeedModel.find({ user: userId })
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture dateOfBirth role followers following'
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User feeds fetched successfully.",
            feeds,
        });
    } catch (error) {
        next(error);
    }
};


// GET feed||Post(s)
export const getFeeds = async (req, res, next) => {
    try {
        const { filter = "{}", sort = "{}", limit, skip = 0, category } = req.query;

        const userFilter = JSON.parse(filter);
        if (category) {
            userFilter.category = category;
        }

        // Build the query step-by-step
        let query = FeedModel.find(userFilter)
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture dateOfBirth role followers following'
            })
            .sort(JSON.parse(sort))
            .skip(parseInt(skip));

        // Only apply limit if provided
        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const userFeed = await query;

        return res.status(200).json(userFeed);
    } catch (error) {
        next(error);
    }
};




//Count feeds||Posts
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

        const fileUrl = req.file?.path || req.body.uploadUrl || "";
        // Ensure the correct URL is assigned

        // Update the feed if it belongs to the authenticated user
        const updatedFeed = await FeedModel.findOneAndUpdate(
            { _id: req.params.id, user: req.auth.id }, // Find post by ID & authenticated user
            {
                ...req.body,
                uploadUrl: fileUrl,
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

    ///// Global action:
// Register a view on a post
export const viewFeed = async (req, res, next) => {
    const { feedId } = req.params;
    const userId = req.auth.id;

    try {
        const feed = await FeedModel.findById(feedId);

        if (!feed) return res.status(404).json({ message: "Post not found." });

        if (!feed.viewers.includes(userId)) {
            feed.viewers.push(userId);
            feed.views += 1;
            await feed.save();
        }

        const populatedFeed = await FeedModel.findById(feedId)
            .populate({
                path: 'viewers',
                select: 'name profilePicture followers following'
            });

        res.status(200).json({
            message: "View recorded.",
            views: populatedFeed.views,
            viewers: populatedFeed.viewers
        });
    } catch (error) {
        next(error);
    }
};

//like a post logic
export const toggleLike = async (req, res, next) => {
    const { feedId } = req.params;
    const userId = req.auth.id;

    try {
        const feed = await FeedModel.findById(feedId);

        if (!feed) return res.status(404).json({ message: "Post not found." });

        const alreadyLiked = feed.likes.includes(userId);

        if (alreadyLiked) {
            feed.likes.pull(userId);
        } else {
            feed.likes.push(userId);
        }

        await feed.save();

        const populatedFeed = await FeedModel.findById(feedId)
            .populate({
                path: 'likes',
                select: 'name profilePicture followers following'
            });

        res.status(200).json({
            message: alreadyLiked ? "Post unliked." : "Post liked.",
            totalLikes: populatedFeed.likes.length,
            likes: populatedFeed.likes
        });
    } catch (error) {
        next(error);
    }
};


//add comment:
export const addComment = async (req, res, next) => {
    const { feedId } = req.params;
    const userId = req.auth.id;
    const { text } = req.body;

    if (!text?.trim()) {
        return res.status(400).json({ message: "Comment text is required." });
    }

    try {
        const feed = await FeedModel.findById(feedId);
        if (!feed) return res.status(404).json({ message: "Post not found." });

        feed.comments.push({ user: userId, text });
        await feed.save();

        const populatedFeed = await FeedModel.findById(feedId)
            .populate({
                path: 'comments.user',
                select: 'name profilePicture followers following'
            });

        res.status(200).json({
            message: "Comment added.",
            totalComments: populatedFeed.comments.length,
            comments: populatedFeed.comments
        });
    } catch (error) {
        next(error);
    }
};

