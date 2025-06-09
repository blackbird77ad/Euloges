import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Function to create storage dynamically based on folder name
 */
const getStorage = (folderName) =>
    new CloudinaryStorage({
        cloudinary,
        params: {
            folder: folderName, // Dynamic folder name
            allowed_formats: ["jpg", "png", "jpeg", "mp4", "pdf"],
            // transformation: [{ width: 500, height: 500, crop: "limit" }],
        },
    });

// Multer middleware for handling profile and cover photo uploads
const uploadProfileAndCover = multer({
    storage: getStorage("profile_pictures"), // Store both in "profile_pictures"
});

// Middleware to handle both profilePicture and coverPhoto
const uploadProfileAndCoverMiddleware = uploadProfileAndCover.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
]);

const uploadProfilePicture = multer({ storage: getStorage("profile_pictures") });
const uploadPost = multer({ storage: getStorage("posts") });
const uploadAdvert = multer({ storage: getStorage("ads") });
const uploadMessage = multer({ storage: getStorage("Messages") });

const uploadMemorial = multer({
    storage: getStorage("memorials"),
});

// Middleware to handle mainPhoto (1) and photoGallery (max 10)
const uploadMemorialImages = uploadMemorial.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "photoGallery", maxCount: 10 },
]);

export {
    uploadProfilePicture,
    uploadMessage,
    uploadPost,
    uploadAdvert,
    uploadProfileAndCover,
    uploadProfileAndCoverMiddleware,
    uploadMemorial,
    uploadMemorialImages,
    cloudinary
};
