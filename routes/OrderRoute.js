import express from "express";
import {
  CreateOrder,
  GetMyAllOrders,
  PaymentController,
  getAllOrderAdmin,
  getMySingleOrder,
  updateOrderStatus,
} from "../controller/OrderController.js";
import { isAdmin, isAuth } from "../middleware/AuthMiddlerware.js";

const route = express.Router();

route.post("/createOrder", isAuth, isAdmin, CreateOrder);

route.get("/MyAll-Orders", isAuth, GetMyAllOrders);

route.get("/getMySingleOrder/:id", isAuth, getMySingleOrder);
route.post("/payement", isAuth, PaymentController);
route.get("/admin-getAllOrder", isAuth, isAdmin, getAllOrderAdmin);
route.put("/updateOrderStatus/:id", isAuth, isAdmin, updateOrderStatus);

export default route;
