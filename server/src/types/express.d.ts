import { Request } from "express";
import type { UserType } from "../models/user.model.js";

declare module "express-serve-static-core" {
	interface Request {
		user?: UserType;
	}
}
