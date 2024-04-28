import express, { Router } from "express";
import {
  UpdatePassword,
  UpdateProfilePicController,
  UserLogout,
  UserProfileController,
  loginController,
  registerController,
  updateUser,
  ResetPassword,
} from "../controller/userController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";
import { singleUpload } from "../middleware/multer.js";

import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

// route object
const route = express.Router();

// routes

route.post("/register", limiter, registerController);
route.post("/login", limiter, loginController);

route.get("/profile", isAuth, UserProfileController);
route.get("/logout", isAuth, UserLogout);
route.put("/updateUser", isAuth, updateUser);
route.put("/updatePassword", isAuth, UpdatePassword);
route.put("/update-pic", isAuth, singleUpload, UpdateProfilePicController);
route.put("/resetPassword", ResetPassword);
// export route
export default route;
