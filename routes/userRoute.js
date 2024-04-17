import express from "express";
import {
  UserProfileController,
  loginController,
  registerController,
} from "../controller/userController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";

// route object
const route = express.Router();

// routes

route.post("/register", registerController);
route.post("/login", loginController);

route.get("/profile", isAuth, UserProfileController);
// export route
export default route;
