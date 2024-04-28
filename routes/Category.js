import express from "express";
import { isAuth } from "../middleware/AuthMiddlerware.js";
import {
  UpdateCategory,
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controller/CategoryController.js";
const route = express.Router();

route.post("/createCategory", isAuth, createCategory);
route.get("/all-category", getAllCategory);
route.delete("/delete/:id", isAuth, deleteCategory);
route.put("/Update/:id", isAuth, UpdateCategory);
export default route;
