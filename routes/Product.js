import express from "express";
import { singleUpload } from "../middleware/multer.js";
import {
  ReviewAndRating,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getAllProducts,
  getSingleProduct,
  getTopProducts,
  updateProduct,
  updateProductImage,
} from "../controller/ProductController.js";
import { isAuth } from "../middleware/AuthMiddlerware.js";
const route = express.Router();

route.get("/all-products", getAllProducts);
route.get("top", getTopProducts);
route.get("/:id", getSingleProduct);
route.post("/createProduct", singleUpload, createProduct);
route.put("/:id", isAuth, updateProduct);
route.put("/image/:id", isAuth, singleUpload, updateProductImage);
route.delete("/delete-image/:id", isAuth, deleteProductImage);
route.delete("/delete/:id", isAuth, deleteProduct);

route.put("/:id/review", ReviewAndRating);
export default route;
