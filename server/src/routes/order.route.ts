import express from "express";
import orderController from "../controllers/order.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(jwtCheck);

router.get("/all", orderController.getAllOrders);
router.get("/", orderController.getOrdersByUser);
router.post("/", orderController.createOrder);
router.post("/verify-payment", orderController.verifyPayment);
router.put("/:id", orderController.updateOrderStatus);

export default router;
