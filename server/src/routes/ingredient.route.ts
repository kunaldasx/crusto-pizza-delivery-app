import express from "express";
import ingredientController from "../controllers/ingredient.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", ingredientController.getAllIngredients);
router.post(
	"/",
	jwtCheck,
	upload.single("image"),
	ingredientController.createIngredient
);
router.put(
	"/:id",
	jwtCheck,
	upload.single("image"),
	ingredientController.updateIngredient
);
router.delete("/:id", jwtCheck, ingredientController.deleteIngredient);
router.patch("/:id", jwtCheck, ingredientController.restoreIngredient);

export default router;
