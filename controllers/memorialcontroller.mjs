import { MemorialModel } from "../models/memorialmodel.mjs";
import { UserModel } from "../models/usermodel.mjs";
import { postMemorialValidator, updateMemorialValidator } from "../validators/memorialvalidator.mjs";


export const postMemorial = async (req, res, next) => {
  try {

      const { error, value } = postMemorialValidator.validate(req.body);
      if (error) {
          return res.status(422).json({ error: error.details[0].message });
      }
       
      const mainPhoto = req.files?.mainPhoto?.[0]?.path || "";
      const photoGallery = req.files?.photoGallery?.map(file => file.path) || [];

      const newMemorial = await MemorialModel.create({
          ...value,
          user: req.auth.id,
          mainPhoto,     
          photoGallery,  
      });

      await UserModel.findByIdAndUpdate(req.auth.id, {
          $push: { memorial: newMemorial._id }, // Also fix "memorials" ➝ "memorial" if that's your schema
      });

      const populatedMemorial = await MemorialModel.findById(newMemorial._id).populate({
          path: 'user',
          model: 'User',
          select: 'name profilePicture role',
      });

      res.status(201).json({
          message: "Memorial created successfully.",
          memorial: populatedMemorial,
      });
  } catch (error) {
      next(error);
  }
};


// Get a user's memorials
export const getUserMemorials = async (req, res, next) => {
    try {
      const userId = req.auth.id;
  
      const memorials = await MemorialModel.find({ user: userId })
        .populate("user", "name profilePicture dateOfBirth")
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        message: "User memorials fetched successfully.",
        memorials
      });
    } catch (error) {
      next(error);
    }
  };
  
  // Get all memorials (with optional filters)
  export const getMemorials = async (req, res, next) => {
    try {
      const { filter = "{}", sort = "{}", limit, skip = 0, category } = req.query;
  
      // Safely parse JSON
      let userFilter = {};
      let sortOption = {};
  
      try {
        userFilter = JSON.parse(filter);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON in 'filter' query param" });
      }
  
      try {
        sortOption = JSON.parse(sort);
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON in 'sort' query param" });
      }
  
      if (category) userFilter.category = category;
  
      let query = MemorialModel.find(userFilter)
        .populate("user", "name profilePicture dateOfBirth")
        .sort(sortOption)
        .skip(Number(skip));
  
      if (limit) {
        query = query.limit(Number(limit));
      }
  
      const result = await query;
  
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  
  
  // Count memorials
  export const  countMemorials = async (req, res, next) => {
    try {
      const { filter = "{}" } = req.query;
      const userFilter = { ...JSON.parse(filter), user: req.auth.id };
  
      const count = await MemorialModel.countDocuments(userFilter);
      res.status(200).json({ total: count });
    } catch (error) {
      next(error);
    }
  };
  
  // Get a single memorial
  export const getMemorial = async (req, res, next) => {
    try {
      const memorial = await MemorialModel.findOne({ _id: req.params.id, user: req.auth.id });
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
  
      res.status(200).json({ memorial });
    } catch (error) {
      next(error);
    }
  };
  
  // Update a memorial
  export const updateMemorial = async (req, res, next) => {
    try {
      const { error } = updateMemorialValidator.validate(req.body);
      if (error) {
        return res.status(422).json({ error: error.details[0].message });
      }
  
      const fileUrl = req.file?.path || req.body.uploadUrl || "";
  
      const updated = await MemorialModel.findOneAndUpdate(
        { _id: req.params.id, user: req.auth.id },
        { ...req.body, uploadUrl: fileUrl },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: "Memorial not found or unauthorized" });
      }
  
      res.status(200).json({ updated });
    } catch (error) {
      next(error);
    }
  };
  
  // Delete a memorial
  export const deleteMemorial = async (req, res, next) => {
    try {
      const deleted = await MemorialModel.findOneAndDelete({
        _id: req.body.id,
        user: req.auth.id
      });
  
      if (!deleted) {
        return res.status(404).json({ error: "Memorial not found" });
      }
  
      res.status(200).json({ message: "Memorial deleted", deleted });
    } catch (error) {
      next(error);
    }
  };
