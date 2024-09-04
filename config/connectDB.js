import mongoose from "mongoose";
const connectDB=async(DATABASE_URL)=>{
    try{
        await mongoose.connect(DATABASE_URL);
        console.log("database connected")
    }catch(error){
        console.log("error while connecting to database",error)
    }    
}

export default connectDB;