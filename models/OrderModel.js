import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    ShippingInfo: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      country: {
        type: String,
        required: [true, "Country is required"],
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Product Name is required"],
        },
        price: {
          type: Number,
          required: [true, "Product Price is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Product quantity is required"],
        },
        image: {
          type: String,
          requried: [true, "Product Image is requried"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    PaidAt: Date,
    paymentInfo: {
      id: String,
      status: String,
    },
    itemPrice: {
      type: Number,
      required: [true, "itemPrice is required"],
    },
    tax: {
      type: Number,
      required: [true, "tax price is required"],
    },
    shippingCharges: {
      type: Number,
      required: [true, "Shipping charges amount is required"],
    },
    totalAmount: {
      type: Number,
      requried: [true, "total price amount is required"],
    },

    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Deliverd"],
      default: "Processing",
    },
    deliverdAt: Date,
  },
  { timestamps: true }
);
export const Order = mongoose.model("Orders", orderSchema);
