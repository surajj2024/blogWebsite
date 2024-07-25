import express from "express";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";
import { loginUser, logoutUser, registerUser } from "../controller/user.controller.js";


const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").delete(JWTauthentication, logoutUser);

export default router;
