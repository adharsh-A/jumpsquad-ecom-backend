import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {type:String,required:true,trim:true},
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {type:String,trim:true},
    image: { type: String, required: true },
  });

  export default mongoose.model("Product", productSchema)