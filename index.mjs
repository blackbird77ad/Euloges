//external packages import
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

//internal imports
import userRouter from "./routes/userrouter.mjs";
import feedRouter from "./routes/feedrouter.mjs";
import messageRouter from "./routes/messagerouter.mjs";
import memorialRouter from "./routes/memorialrouter.mjs";
import advertRouter from "./routes/advertrouter.mjs";
import dashboardRouter from "./routes/Dashboardrouter.mjs";

//DB connection:
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ DB connected");
    app.listen(process.env.PORT || 4000, () => {
      console.log("🚀 Server listening");
    });
  })


//create express app
const app = express();

//use middlewares
app.use(express.json());
app.use(cors());

//Use app
app.use(feedRouter);
app.use(dashboardRouter);
app.use(userRouter);
app.use(messageRouter);
app.use(advertRouter);
app.use(memorialRouter);




//listen for incoming request
const PORT = 5001;
app.listen(PORT, () => {console.log(`App is listening on port: ${PORT}`)});



