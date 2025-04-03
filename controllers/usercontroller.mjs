//internal import
import {UserModel} from "../models/usermodel.mjs";
import {DashboardModel} from "../models/dashboardmodel.mjs";
import {
    userSignInValidator,
    userSignUpValidator,
    userUpdateValidator
} from "../validators/uservalidator.mjs";
import {
    signUpEmailTemplate,
    signInEmailTemplate,
    userUpdateEmailTemplate
} from "../utils/templates.mjs";
import {mailTransporter} from "../utils/mail.mjs";

//external packages
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// User signup controller
export const userSignup = async (req, res, next) => {
    try {
        // Validate req.body
        const { error, value } = userSignUpValidator.validate(req.body);
        if (error) {
            return res.status(422).json({ error: error.details });
        }

        // Check if the email exists already
        const existingUser = await UserModel.findOne({ email: value.email });
        if (existingUser) {
            return res.status(409).json("You already have an account, log in instead");
        }

        // Hash password before saving to database
        const hashedPassword = bcrypt.hashSync(value.password, 10);

        //Save||User to database
        const newUser = await UserModel.create({
            ...value,
            password: hashedPassword,
            profilePicture: req.files?.profilePicture ? req.files.profilePicture[0].path : null,
            coverPhoto: req.files?.coverPhoto ? req.files.coverPhoto[0].path : null,
        });

        //Create a new dashboard for the user
        const newDashboard = await DashboardModel.create({
            user: newUser._id,
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            totalViews: 0,
            lastActive: Date.now(),
        })

        // Link the dashboard to the user profile
        newUser.dashboard = newDashboard._id;
        await newUser.save();


        // Content/Body of email
        const emailContent = `
        <p>Dear ${value.name},</p>
        <p style="color: #1E90FF;">Thank you for choosing EULOGES. We are excited to have you on board!</p>
        `;

        // Send the registration email
        await mailTransporter.sendMail({
            from: 'EULOGES <byourself77by@gmail.com>',
            to: value.email,
            subject: 'USER REGISTRATION',
            html: signUpEmailTemplate(emailContent)
        });

        //Exclude password before sending response
        const { password, ...userWithoutPassword } = newUser.toObject();

        // Respond to the request
        return res.status(201).json({
            message: "User successfully registered!",
            user: userWithoutPassword
        });
    } catch (error) {
        next(error);
    }
};



//user login controller
export const userSignIn = async (req, res, next) => {
    try{
        //validate login user request
       const {error, value} = userSignInValidator.validate(req.body);
       if (error) {
           res.status(400).json({error: error.details});
       }
       //Find if User exist already
        const user = await UserModel.findOne({email: value.email});
       if (!user) {
           res.status(404).json("User not found");
       }
       // check if value.password match db password
        const correctPassword = await bcrypt.compare(value.password, user.password);
       if (!correctPassword) {
           res.status(404).json("Invalid User Credentials");
       }
       // if value.password matches db user password, enable session|token
        const session = jwt.sign(
            {
                id: user.id, email: user.email
            },
            process.env.JWT_PRIVATE_KEY,
            {
                expiresIn: "24h",
            });
//get current timestamp for user login attempt
        const loginTime = new Date().toLocaleString();

        // respond to request
        return res.status(200).json(
            {
                message: 'User logged in!',
                accessToken: session
            }
        );
    }
    catch (error){
        next(error);
    }
};


// User Logout  controller:
const blacklistedTokens = new Set();

export const userLogOut = async (req, res, next) => {
    try {
        // Corrected: Proper way to access headers
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(422).json({ message: "No token assigned!" });
        }

        //  Add token to the blacklist
        blacklistedTokens.add(token);

        // Return a properly formatted JSON response
        return res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
        next(error);
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//1. Get logged-in user profile
export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id).select(
            {
                password: false,
            }
        ); //Exclude password from response

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

//2. Get another user's profile by ID
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract user ID from request params

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        let user;

        if (req.auth.id === id) {
            // If the logged-in user is requesting their own profile, return full details
            user = await UserModel.findById(id).select("-password -confirmPassword -resetToken");
        } else {
            // If the user is requesting another user's profile, restrict some fields
            user = await UserModel.findById(id).select(
                "-password -email -resetToken -dateOfBirth -updatedAt -role"
            );
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


//3. Get all users with optional filtering
export const getAllUsers = async (req, res, next) => {
    try {
        const { name } = req.query; // Get name filter from query params

        let query = {};

        if (name) {
            query = { username: { $regex: name, $options: "i" } }; // Case-insensitive name search
        }

        const users = await UserModel.find(query).select(
            {
                password: false,
                confirmPassword: false,
                email: false,
                resetToken: false,
                dateOfBirth: false,
                updatedAt: false,
                role: false,
            }
        );

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};


//Update User Information|Profile
export const updateProfile = async (req, res, next) => {
     try {
         //Validate the post method | req.body
         const { error, value } = userUpdateValidator.validate(req.body);
         if (error) {
             return res.status(422).json({ error: error.details[0].message });
         }

         // Find and update user, exclude password from response
         const updatedUser = await UserModel.findByIdAndUpdate(
             req.auth.id,
             { new: true, runValidators: true }
         ).select("-password");

         if (!updatedUser) {
             return res.status(404).json("User not found!");
         }

         // Handle Profile Picture Upload
         if (req.files && req.files.profilePicture) {
             updatedUser.profilePicture = req.files.profilePicture[0].path; // Cloudinary stores URLs in `path`
         }

         // Handle Cover Photo Upload
         if (req.files && req.files.coverPhoto) {
             updatedUser.coverPhoto = req.files.coverPhoto[0].path;
         }

         // Store updated time for reference
         const UpdatedTime = new Date().toLocaleString();

         //Nodemailer function to update user about this action:
         const emailContent = `
         <p>Dear ${value.name},</p>\n
         
         <p>We realised that your profile has been updated at ${UpdatedTime}.
         and reach out to our technical Support team
         </p>
         <p style="color: #ffffff;">Thank you for choosing EULOGES. We are excited to have you on board!</p>
        </p>
         `

         // Send the registration email
         await mailTransporter.sendMail({
             from: 'EULOGES <byourself77by@gmail.com>',
             to: value.email,
             subject: 'PROFILE UPDATE CONFIRMATION',
             html: userUpdateEmailTemplate(emailContent)
         });

         //respond to user update request
         return res.status(200).json(updatedUser);
     }
     catch (error) {
         next(error);
     }
}
export const deleteProfile = async (req, res, next) => {
    try {
        // ✅ Check if user exists
        const user = await UserModel.findById(req.auth?.id);
        if (!user) {
            return res.status(404).json({ message: "Action Denied! User not found!" });
        }

        // ✅ Store email & name before deletion
        const userEmail = user.email;
        const userName = user.name;
        const deleteTime = new Date().toLocaleString();

        // ✅ Delete the user
        const deletedUser = await UserModel.findByIdAndDelete(req.auth.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found or already deleted!" });
        }

        // ✅ Send email confirmation
        try {
            await mailTransporter.sendMail({
                from: 'EULOGES <byourself77by@gmail.com>',
                to: userEmail,
                subject: 'ACCOUNT DELETION UPDATE',
                text: `Hi ${userName},\n\nYour account has been deleted on ${deleteTime}. If this wasn't you, contact support.\n\nBest,\nEuloges`
            });
        } catch (emailError) {
            console.error("Email error:", emailError);
            return res.status(500).json({ message: "Account deleted, but email notification failed!" });
        }

        // ✅ Respond with success
        return res.status(200).json({ message: "Account Deleted Successfully! A confirmation email has been sent!" });
    } catch (error) {
        console.error("Delete user error:", error);
        next(error);
    }
};


// Follow a user
export const followUser = async (req, res, next) => {
    const { userIdToFollow } = req.body;

    try {
        // Add the user to the following list of the requester
        await UserModel.findByIdAndUpdate(req.auth.id, { $addToSet: { following: userIdToFollow } });

        // Add the requester to the followers list of the followed user
        await UserModel.findByIdAndUpdate(userIdToFollow, { $addToSet: { followers: req.auth.id } });

        res.status(200).json({ message: 'You are now following this user.' });
    } catch (error) {
        next(error);
    }
};

// Unfollow a user
export const unfollowUser = async (req, res, next) => {
    const { userIdToUnfollow } = req.body;

    try {
        // Remove the user from the following list of the requester
        await UserModel.findByIdAndUpdate(req.auth.id, { $pull: { following: userIdToUnfollow } });

        // Remove the requester from the followers list of the unfollowed user
        await UserModel.findByIdAndUpdate(userIdToUnfollow, { $pull: { followers: req.auth.id } });

        res.status(200).json({ message: 'You have unfollowed this user.' });
    } catch (error) {
        next(error);
    }
};