import { AuthController } from "../controllers/authController";
import Router from "express";

// ============= AUTH ROUTES =============
export const authRouter = Router();
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);