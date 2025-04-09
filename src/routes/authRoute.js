import express from "express";
import {
  registerController,
  loginController,
  testController,
  isAdmin
} from "../controllers/auth.controller.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected route.get
router.get('/user-auth', requireSignIn, (req,res)=>{
    res.status(200).send({ok:true});
})

export default router;

