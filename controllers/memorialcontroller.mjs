import { MemorialModel } from "../models/memorialmodel.mjs";
import { UserModel } from "../models/usermodel.mjs";
import { postMemorialValidator, updateMemorialValidator } from "../validators/memorialvalidator.mjs";


export const postMemorial = async (req, res, next) => {
  try {
    req.body.program = JSON.parse(req.body.program);
    req.body.tribute = JSON.parse(req.body.tribute);

    console.log("Files received:", req.files);
console.log("Body received:", req.body);

     console.log("Received files:", req.files);
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
          $push: { memorial: newMemorial._id },
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
      const memorial = await MemorialModel.findById(req.params.id);
  
      if (!memorial) {
        return res.status(404).json({ error: "Memorial not found" });
      }
  
      res.status(200).json({ memorial });
    } catch (error) {
      next(error);
    }
  };


  export const updateMemorial = async (req, res, next) => {
    try {
      const memorialId = req.params.id;
  
      // Parse JSON strings if present
      if (req.body.program) req.body.program = JSON.parse(req.body.program);
      if (req.body.tribute) req.body.tribute = JSON.parse(req.body.tribute);
  
      console.log("Files received (UPDATE):", req.files);
      console.log("Body received (UPDATE):", req.body);
  
      // Validate update body
      const { error, value } = updateMemorialValidator.validate(req.body);
      if (error) {
        return res.status(422).json({ error: error.details[0].message });
      }
  
      // Handle updated images if available
      const mainPhoto = req.files?.mainPhoto?.[0]?.path;
      const photoGallery = req.files?.photoGallery?.map(file => file.path);
  
      const updateFields = {
        ...value,
      };
  
      if (mainPhoto) updateFields.mainPhoto = mainPhoto;
      if (photoGallery && photoGallery.length > 0) updateFields.photoGallery = photoGallery;
  
      // Update memorial and return updated document
      const updatedMemorial = await MemorialModel.findByIdAndUpdate(
        memorialId,
        updateFields,
        { new: true }
      ).populate({
        path: "user",
        model: "User",
        select: "name profilePicture role",
      });
  
      if (!updatedMemorial) {
        return res.status(404).json({ message: "Memorial not found." });
      }
  
      res.status(200).json({
        message: "Memorial updated successfully.",
        memorial: updatedMemorial,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  
  

export const deleteMemorial = async (req, res, next) => {
  try {
    const memorialId = req.params.id;

    const memorial = await MemorialModel.findById(memorialId);

    if (!memorial) {
      return res.status(404).json({ message: "Memorial not found." });
    }

    // Ensure the logged-in user is the owner
    if (memorial.user.toString() !== req.auth.id) {
      return res.status(403).json({ message: "Not authorized to delete this memorial." });
    }

    // Delete the memorial
    await MemorialModel.findByIdAndDelete(memorialId);

    // Remove memorial from the user's list
    await UserModel.findByIdAndUpdate(req.auth.id, {
      $pull: { memorial: memorialId },
    });

    res.json({ message: "Memorial deleted successfully." });
  } catch (err) {
    next(err);
  }
};
