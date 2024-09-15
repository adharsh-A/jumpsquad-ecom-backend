import HttpError from "../models/http-error.js";
import User from "../models/user.js";

export const updatePersonalInfo = async (req, res) => {
  res.send({ message: "Personal info updated successfully" });
  const { userId, username, address } = req.body;
  const { Location, Bucket, Key, ETag } = req.s3Data;


  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (username) {
      user.username = username;
    }
    if (address) {
      user.address = address;
    }
    if (Location) {
      user.image=Location ? Location : null;

    }
    await user.save();

    res.status(200).json({ message: "Personal info updated successfully" });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Something went wrong", 500));
  }
};
