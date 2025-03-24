import { NotificationModel } from '../models/notification.mjs';
import { notificationValidator } from '../validators/notificationValidator.mjs';

// Function to send notification to users when a follower posts
export const notifyFollowersOfPost = async (followerIds, postDetails) => {
    const notifications = followerIds.map(followerId => ({
        user: followerId,
        type: 'post',
        message: `${postDetails.user.username} has posted a new update: "${postDetails.title}"`,
        link: `/posts/${postDetails.id}`, // Link to the post
    }));

    await NotificationModel.insertMany(notifications);
};

// Function to send notification when a user receives a message
export const notifyUserOfMessage = async (recipientId, messageDetails) => {
    const notificationData = {
        user: recipientId,
        type: 'message',
        message: `You have received a new message from ${messageDetails.sender.username}: "${messageDetails.content}"`,
        link: `/messages/${messageDetails.id}`, // Link to the message
    };

    // Validate notification data
    const { error } = notificationValidator.validate(notificationData);
    if (error) {
        throw new Error(error.details[0].message); // Handle validation error
    }

    await NotificationModel.create(notificationData);
};