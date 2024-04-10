import express from "express";
import { TestController } from "../controller/TestController.js";

const router = express.Router();

router.get("/test", TestController);

export default router;
