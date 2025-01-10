import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", jwtCheck, dashboardController.getAnalytics);
router.post("/", jwtCheck, dashboardController.addActivity);

export default router;
