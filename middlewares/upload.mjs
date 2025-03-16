import multer from "multer";
import { multerSaveFilesOrg } from "multer-savefilesorg";

//remote storage creation
export const profilePic = multer({
    storage: multerSaveFilesOrg({
        apiAccessToken: process.env.SAVEFILESORG_API_KEY,
        relativePath: '/Euloges/Profile-pictures/*'
    }),
    preservePath: true
})
