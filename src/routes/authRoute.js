import { Router } from "express";
import { registerController, loginController, test, isAdmin } from "../controllers/auth.controller.js";
import { requireSignIn } from "../middlewares/authMiddleware.js"

const authRouter = Router();

authRouter.post('/register', registerController)
authRouter.post('/login', loginController)
authRouter.get('/test', requireSignIn,isAdmin, test)

export default authRouter;
