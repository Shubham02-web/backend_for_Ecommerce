import express from "express";
import { singleUpload } from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
} from "../controller/ProductController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";
const route = express.Router();

route.get("/all-products", getAllProducts);
route.get("/:id", getSingleProduct);
route.post("/createProduct", isAuth, singleUpload, createProduct);
export default route;
