import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signup = async (req, res, next) => {
    const { username, password} = req.body;

    let existingUser;
    try {
    existingUser = await User.findOne({ username: username });
    } catch (err) {
    const error = new HttpError(
        'Signing up failed, please try again later.',
        500
    );
    return next(error);
    }

    if (existingUser) {
    const error = new HttpError(
        'User exists already, please login instead.',
        422
    );
    return next(error);
    }

    if (typeof password !== 'string' || password.trim() === '') {
        const error = new HttpError(
          'Password is required.',
          400
        );
        return next(error);
      }

   let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    username,
    password: hashedPassword,
    role: role || "user",
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign({
        username: createdUser.username,
        id: createdUser._id,
        role: createdUser.role
    }
    , process.env.JWT_KEY,
     { expiresIn: '1h' });
  }catch(err){
    return  next(new HttpError('Signing up failed, please try again later.', 500));
  }
  res
  .status(201)
  .json({ userId: createdUser.username, token: token,role:createdUser.role });   
}

 export  const login = async (req, res, next) => {
    const { username, password } = req.body;

    let existingUser;
    try {
    existingUser = await User.findOne({ username: username });
    } catch (err) {
    const error = new HttpError(
        'Logging in failed, please try again later.',
        500
    );
    return next(error);
    }

    if (!existingUser) {
    const error = new HttpError("Invalid credentials, could not log you in.", 500);
    }

    let isValidPassword = false;
    try {
        isValidPassword=await bcrypt.compare(password, existingUser.password)

    } catch (err) {
        return next(new HttpError("Could not log you in, please check your credentials.", 500));
    }
    if (!isValidPassword) {
        return next(new HttpError("Invalid Password.",403))
    }
    let token;
  try {
    token = jwt.sign({
        username: existingUser.username,
        role: existingUser.role
    }
    , process.env.JWT_KEY,
     { expiresIn: '1h' });
  }catch(err){
    return  next(new HttpError('Logging in failed, please try again later.', 500));
  }
  res.status(201)
  .json({ userId: existingUser.id, 
    token: token ,
    role: existingUser.role
  });   

}
export default {login, signup};