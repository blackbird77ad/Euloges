import {AdvertModel} from "../models/advertmodel.mjs";
import {advertValidator} from "../validators/advertvalidator.mjs";


//ONLY ADMIN ADS POST
export const postAdvert = async (req, res, next) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can post advertisements.' });
        }
        //validate incoming request
        const {error, value} = AdvertModel.validate(req.body)
        if (error) {
            return res.status(422).json({error: error.details[0].message});
        }
        // Save Advert to the database
        const newAdvert = await AdvertModel.create({
            ...value,
            admin: req.auth.id,})

            //Respond to req
            res.status(201).json({
                message: 'Your advertisement has been created successfully.',
                advert: newAdvert,
            })
    }
    catch (error) {
        next(error);
    }
}

// Get all advertisements (All roles)
export const getAdverts = async (req, res, next) => {
    try {
        const adverts = await AdvertModel.find();
        res.json(adverts);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};


// Update an advertisement (Admin only)
export const updateAdvert = async (req, res, next) => {
    // Check if the user is an admin
    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can update advertisements.' });
    }
    try {
        const advert = await AdvertModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!advert) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.status(201).json(advert);
    } catch (error) {
        next(error);
    }
};

// Delete an advertisement (Admin only)
export const deleteAdvert = async (req, res, next) => {
    // Check if the user is an admin
    if (req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Only admins can delete advertisements.' });
    }

    try {
        const advert = await AdvertModel.findByIdAndDelete(req.params.id);

        if (!advert) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        res.status(204).json("Advert successfully deleted")
    } catch (error) {
        next(error);
    }
};
