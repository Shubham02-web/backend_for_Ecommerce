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

// route object
const route = express.Router();

// routes

route.post("/register", registerController);
route.post("/login", loginController);

route.get("/profile", isAuth, UserProfileController);
route.get("/logout", isAuth, UserLogout);
route.put("/updateUser", isAuth, updateUser);
route.put("/updatePassword", isAuth, UpdatePassword);
route.put("/update-pic", isAuth, singleUpload, UpdateProfilePicController);
route.put("/resetPassword", ResetPassword);
// export route
export default route;
