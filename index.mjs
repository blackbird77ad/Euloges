//external packages import
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//internal imports
import userRouter from "./routes/userrouter.mjs";
import feedRouter from "./routes/feedrouter.mjs";
import Dashboardrouter from "./routes/Dashboardrouter.mjs";
import messageRouter from "./routes/messagerouter.mjs";
import advertRouter from "./routes/advertrouter.mjs";

//DB connection:
const MONGODB_URI = process.env.MONGODB_URI;

try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
} catch (err) {
    console.error('Failed to connect to MongoDB:', err);
}


//create express app
const app = express();

//use middlewares
app.use(express.json());
app.use(cors());

//use route in app
app.use(userRouter);
app.use(Dashboardrouter);
app.use(feedRouter);
app.use(messageRouter);
app.use(advertRouter);


//listen for incoming request
const PORT = 5001;
app.listen(PORT, () => {console.log(`App is listening on port: ${PORT}`)});



