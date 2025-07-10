import express from "express";
import { verifyToken } from "../middlewares/auth.mjs";
import { uploadMemorialImages,  } from "../config/cloudinary.mjs";
import {
  postMemorial,
  getMemorial,
  getMemorials,
  getUserMemorials,
  countMemorials,
  updateMemorial,
  deleteMemorial,
} from "../controllers/memorialcontroller.mjs";

const memorialRouter = express.Router();

//Static routes come first
memorialRouter.post("/create-memo", verifyToken, uploadMemorialImages, postMemorial);
memorialRouter.get("/get-user-memo", getUserMemorials);
memorialRouter.get("/get-memos", getMemorials);
memorialRouter.get("/count", verifyToken, countMemorials);

//Dynamic routes come after
memorialRouter.get("/get-this-memo/:id", getMemorial);
memorialRouter.patch("/update-memo/:id", verifyToken, uploadMemorialImages, updateMemorial);
memorialRouter.delete("/del-memo/:id", verifyToken, deleteMemorial); 

export default memorialRouter;
