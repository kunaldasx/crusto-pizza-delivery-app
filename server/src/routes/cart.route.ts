import express from "express";
import cartController from "../controllers/cart.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(jwtCheck);

router.post("/sync", cartController.syncCart);
router.post("/items", cartController.addToCart);
router.put("/items/:id", cartController.updateCart);
router.delete("/items/:id", cartController.removeFromCart);
router.delete("/items", cartController.clearCart);

export default router;
