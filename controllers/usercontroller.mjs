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
        const correctPassword = bcrypt.compare(value.password, user.password);
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
         const token = req.headers("Authorization")?.split(" ")[1];
         if (!token) {
             return res.status(422).json({message: "No token assigned!"});
         }
         //If token blacklist it
         blacklistedTokens.add(token);
         //respond to request:
         return res.status(200).json("Logged out successfully!");
     }
     catch (error){
         next(error);
     }
 }

 //Get User Info
export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id).select(
            {
                password: false,
                confirmPassword: false
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
             value,
             { new: true, runValidators: true }
         ).select("-password");

         if (!updatedUser) {
             return res.status(404).json("User not found!");
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

//Delete user account function:
export const deleteProfile = async (req, res, next) => {
     try {
         //Find user and save email & name before deleting account:
         const user = await UserModel.findById(req.auth.id);

         //If not user in Db
         if (!user) {
             return res.status(404).json({ message: "Action Denied! User not found!" });
         }

         //If user then store email and name
         const userEmail = user.email;
         const userName = user.name;

         //Deletion time
         const deleteTime = new Date().toLocaleString();

// Delete user account here
         await UserModel.findByIdAndDelete(req.auth.id);


         //Send a notification to update the user
         await mailTransporter.sendMail({
             from: 'EULOGES <byourself77by@gmail.com>',
             to: userEmail,
             subject: 'ACCOUNT DELETION UPDATE',
             text: `Hi ${userName},\n\nYour account has been deleted on ${deleteTime}. If this wasn't you, contact support.\n\nBest,\nEuloges`
         });
         //Send a deletion success response.
         return res.status(200).json(`Account Deleted Successfully! A confirmation email has been sent!`);
}
catch (error) {
     next(error);}
}