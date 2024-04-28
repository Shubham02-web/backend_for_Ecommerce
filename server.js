import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import cookie from "cookie-parser";
import cloudinary from "cloudinary";
import Stripe from "stripe";

// import db connection
import connectDB from "./config/db.js";
// importing routes
import TestRouter from "./routes/TestRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/Product.js";
import categoryRoute from "./routes/Category.js";
import OrderRoute from "./routes/OrderRoute.js";
// Dot Env Config

dotenv.config();

// Stripe config

export const stripe = new Stripe(process.env.STRIPE_API_SECRET);
// Objects
const app = express();
const mongo_uri = process.env.MONGO_URL || "";
// MiddleWars
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookie());

app.get("/", function (req, res, next) {
  res.status(200).send("<h1>hello I am HTML text</h1>");
});

connectDB(mongo_uri);

// cloudniary configurtion

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Router Use
app.use("/api/v1/user", userRoute);
app.use("/api/v1", TestRouter);
app.use("/api/v1/Products", productRoute);
app.use("/api/v1/Cat", categoryRoute);
app.use("/api/v1/orders", OrderRoute);

const Port = process.env.PORT || 8080;

app.listen(Port, function (req, res) {
  console.log(
    `listning on port no ${Port} on ${process.env.NODE_ENV} mode`.bgBlack.white
  );
});
