import express from "express";
import { singleUpload } from "../middleware/multer.js";
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  updateProductImage,
} from "../controller/ProductController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";
const route = express.Router();

route.get("/all-products", getAllProducts);
route.get("/:id", getSingleProduct);
route.post("/createProduct", isAuth, singleUpload, createProduct);
route.put("/:id", isAuth, updateProduct);
route.put("/image/:id", isAuth, singleUpload, updateProductImage);
route.delete("/delete-image/:id", isAuth, deleteProductImage);
route.delete("/delete/:id", isAuth, deleteProduct);
export default route;
