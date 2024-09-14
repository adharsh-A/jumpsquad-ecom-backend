import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      image: {
        type: String,
      },
      title: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
  ],
});

export default mongoose.model("Wishlist", wishlistSchema);
