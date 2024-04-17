import { User } from "../models/UserModel.js";
import cookie from "cookie-parser";
export const registerController = async (req, res, next) => {
  const { name, email, password, address, city, country, phone, profilePic } =
    req.body;

  if (
    !name ||
    !email ||
    !password ||
    !address ||
    !city ||
    !country ||
    !phone ||
    !profilePic
  )
    return console.log("all fields are required");
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        succes: false,
        message: "these email is already used",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      profilePic,
    });

    return res.status(201).json({
      succes: true,
      message: "user created succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      succes: false,
      messgae: "Error in user register",
      error,
    });
  }
};
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.send("please enter email or password");

    const user = await User.findOne({ email });

    if (!user) return res.send("user not found");
    const ISmatch = await user.comparePassword(password);
    if (!ISmatch) return res.send("invalid details");

    const token = user.generateToken();
    res
      .status(200)
      .cookie("token", token, {
        expire: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "Development" ? true : false,
        httpOnly: process.env.NODE_ENV === "Development" ? true : false,
        sameSite: process.env.NODE_ENV === "Development" ? true : false,
      })
      .json({
        succes: true,
        message: "you are login",
        token,
        user,
      });
  } catch (error) {
    return console.log(error);
    return res.status(400).json({
      succes: false,
      message: "error in login",
    });
  }
};

export const UserProfileController = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(401).send({
      succes: true,
      message: "user profile fatched suceesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      succes: false,
      message: "Internal server Error",
      error,
    });
  }
};
