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
            allowed_formats: ["jpg", "png", "jpeg"],
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        },
    });

const uploadProfilePicture = multer({ storage: getStorage("profile_pictures") });
const uploadPost = multer({ storage: getStorage("posts") });
const uploadAdvert = multer({ storage: getStorage("ads") });
const uploadMessage = multer({ storage: getStorage("ads") });
export { uploadProfilePicture, uploadPost, uploadAdvert, cloudinary };
