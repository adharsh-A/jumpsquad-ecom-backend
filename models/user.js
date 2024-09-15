import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type:String,required:true,trim:true},
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },// Default role is user
    address: {type:String,required:false,trim:true},
    image: { type: String, required: false },
  });

  export default mongoose.model("User", userSchema)