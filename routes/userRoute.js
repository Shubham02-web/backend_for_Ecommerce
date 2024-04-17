import express from "express";
import {
  UpdatePassword,
  UserLogout,
  UserProfileController,
  loginController,
  registerController,
  updateUser,
} from "../controller/userController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";

// route object
const route = express.Router();

// routes

route.post("/register", registerController);
route.post("/login", loginController);

route.get("/profile", isAuth, UserProfileController);
route.get("/logout", isAuth, UserLogout);
route.put("/updateUser", isAuth, updateUser);
route.put("/updatePassword", isAuth, UpdatePassword);
// export route
export default route;
