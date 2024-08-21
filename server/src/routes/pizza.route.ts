import express from "express";
import pizzaController from "../controllers/pizza.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", pizzaController.getAllPizzas);
router.post(
	"/",
	jwtCheck,
	upload.array("images", 5),
	pizzaController.createPizza
);
router.put(
	"/:id",
	jwtCheck,
	upload.array("images", 5),
	pizzaController.updatePizza
);
router.delete("/:id", jwtCheck, pizzaController.deletePizza);

export default router;
