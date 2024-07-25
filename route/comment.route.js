import express from "express";
import { createComment, deleteComment, editComment } from "../controller/comment.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";


const router = express.Router();

router.route("/:id")
.post(JWTauthentication,createComment)
.put(JWTauthentication,editComment)
.delete(JWTauthentication,deleteComment)

export default router;
