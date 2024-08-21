import express from "express";
import customPizzaController from "../controllers/customPizza.controller.js";
import { jwtCheck } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import { processPizzaData } from "../middleware/processPizzaData.middleware.js";

const router = express.Router();

router.post("/sync", jwtCheck, customPizzaController.syncCustomPizzas);
router.post(
	"/",
	jwtCheck,
	upload.array("images", 5),
	customPizzaController.createCustomPizza
);
router.put(
	"/:id",
	jwtCheck,
	upload.array("images", 5),
	customPizzaController.updateCustomPizza
);
router.delete("/:id", jwtCheck, customPizzaController.deleteCustomPizza);

router.post(
	"/pizza-details",
	upload.none(),
	processPizzaData,
	customPizzaController.getPizzaPriceAvailability
);

export default router;
