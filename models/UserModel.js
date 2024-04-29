import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "name is required"],
    },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: [true, "email already taken"],
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      require: [true, "password is required"],
      minLength: [6, "passwprd should be greter than or equal to 6 character"],
    },
    address: {
      type: String,
      require: [true, "address must be require"],
    },
    city: {
      type: String,
      require: [true, "city required"],
    },
    country: {
      type: String,
      require: [true, "country name required"],
    },
    phone: {
      type: Number,
      require: [true, "phone number is required"],
      minLength: [10, "phone number must be in 10 digit"],
    },
    answer: {
      type: String,
      require: [true, "answer is required"],
    },
    profilePic: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
// functions
// hash function
userSchema.pre("save", async function (req, res, next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
});

// compare function
userSchema.methods.comparePassword = async function (planPassword) {
  return await bcrypt.compare(planPassword, this.password);
};

// JWT TOken

userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const User = mongoose.model("Users", userSchema);
