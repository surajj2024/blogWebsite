import express from "express";
import upload from "../middlewere/multer.js";
import {
  handleDownload,
  handleFilePostRoute,
  handleGetLink,
  handleSendMail,
} from "../controllers/file.controller.js";

const route = express.Router();

route.post("/api/file/post", upload.single("file"), handleFilePostRoute);

route.get("/files/:uuid", handleGetLink);

route.get("/files/download/:uuid", handleDownload);

route.post("/api/files/send", handleSendMail);
 
export default route;
