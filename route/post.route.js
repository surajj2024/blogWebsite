// routes/post.routes.js
import express from "express";
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getOnePost,
} from "../controller/post.controller.js";
import { JWTauthentication } from "../middlewere/auth.middlewere.js";
import upload from "../middlewere/multer.middlewere.js";

const router = express.Router();

router
  .route("/:id")
  .get(getOnePost)
  .put(upload.single("image"), updatePost)
  .delete(JWTauthentication, deletePost);

router
  .route("/")
  .get(getAllPosts)
  .post(JWTauthentication, upload.single("image"), createPost);

export default router;
