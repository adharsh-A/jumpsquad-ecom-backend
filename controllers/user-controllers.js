import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export const updatePersonalInfo = async (req, res, next) => {
  const { userId, username, address } = req.body;
  const Location = req.s3Data?.Location || null;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields if provided
    if (username) {
      user.username = username;
    }
    if (address) {
      user.address = address;
    }
    if (Location) {
      user.image = Location;
    } else if (user.image && !Location) {
      // Optionally, you can set to null or keep the existing image if Location is not provided
      user.image = user.image; // Or set to null if you prefer: user.image = null;
    }

    await user.save();

    res.status(200).json({ message: "Personal info updated successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong", 500));
  }
};
