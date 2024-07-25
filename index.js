import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./route/user.route.js";
import postRouter from "./route/post.route.js";
import commentRouter from "./route/comment.route.js"
import dbConnect from "./config/dbConnect.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);

// Database Connection
dbConnect();

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
