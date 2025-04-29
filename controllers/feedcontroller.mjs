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
// Register viewers and view on a post
export const updateFeedViews = async (req, res, next) => {
  const { feedId } = req.body;
  const userId = req.auth.id;

  try {
    const feed = await FeedModel.findById(feedId);
    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    // Check if user has already viewed the post
    const alreadyViewed = feed.viewers.includes(userId);
    if (!alreadyViewed) {
      feed.views += 1;
      feed.viewers.push(userId);
      await feed.save();
    }

    // Populate viewer data (optional, depending on what you want to return)
    const populatedFeed = await FeedModel.findById(feedId)
      .populate("viewers", "name profilePicture");

    res.status(200).json({
      message: "View updated",
      viewsCount: populatedFeed.views,
      viewers: populatedFeed.viewers,
    });

  } catch (error) {
    next(error);
  }
};




//like a post logic
export const toggleLikeFeed = async (req, res, next) => {
    const { feedId } = req.body;
    const userId = req.auth.id;

    try {
        const feed = await FeedModel.findById(feedId);

        if (!feed) return res.status(404).json({ message: "Feed not found" });

        const hasLiked = feed.likes.includes(userId);

        if (hasLiked) {
            feed.likes.pull(userId);
            await feed.save();
            return res.status(200).json({ message: "Feed unliked." });
        } else {
            feed.likes.push(userId);
            await feed.save();
            return res.status(200).json({ message: "Feed liked." });
        }

    } catch (error) {
        next(error);
    }
};


//add comment:
export const addCommentToFeed = async (req, res, next) => {
    const { feedId, text } = req.body;
    const userId = req.auth.id;

    try {
        const feed = await FeedModel.findById(feedId);

        if (!feed) return res.status(404).json({ message: "Feed not found" });

        feed.comments.push({
            user: userId,
            text,
        });

        await feed.save();

        res.status(200).json({ message: "Comment added." });
    } catch (error) {
        next(error);
    }
};


////GET VIEWS, COMMENT, LIKES
export const getFeedLikes = async (req, res, next) => {
    const { feedId } = req.params;

    try {
        const feed = await FeedModel.findById(feedId).populate("likes", "name profilePicture");

        if (!feed) return res.status(404).json({ message: "Feed not found" });

        res.status(200).json({
            totalLikes: feed.likes.length,
            likes: feed.likes
        });
    } catch (error) {
        next(error);
    }
};

//Get comment
export const getFeedComments = async (req, res, next) => {
    const { feedId } = req.params;

    try {
        const feed = await FeedModel.findById(feedId).populate("comments.user", "name profilePicture");

        if (!feed) return res.status(404).json({ message: "Feed not found" });

        res.status(200).json({
            totalComments: feed.comments.length,
            comments: feed.comments
        });
    } catch (error) {
        next(error);
    }
};

//Get views:
export const getFeedViewers = async (req, res, next) => {
    const { feedId } = req.params;
    const requesterId = req.auth.id;

    try {
        const feed = await FeedModel.findById(feedId).populate("viewers", "name profilePicture");

        if (!feed) return res.status(404).json({ message: "Feed not found" });

        if (feed.user.toString() !== requesterId) {
            return res.status(403).json({ message: "Only the post owner can view this." });
        }

        res.status(200).json({
            totalViews: feed.views,
            viewers: feed.viewers
        });
    } catch (error) {
        next(error);
    }
};




