import mongoose from "mongoose";
const review = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      ref: "Users",
      required: [true, "name is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
    },
    comment: {
      type: String,
      required: [true, "comment is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "user is required"],
    },
  },
  {
    timestamps: true,
  }
);
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product name is required"],
    },
    description: {
      type: String,
      required: [true, "product description required"],
    },
    price: {
      type: Number,
      required: [true, "product price required"],
    },
    stock: {
      type: Number,
      required: [true, "product stock is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [review],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Products", ProductSchema);
export default ProductModel;
