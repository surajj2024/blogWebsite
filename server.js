import express from "express";

import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./dbConnect.js";
import route from "./routes/file.route.js";
import errorHandlingMiddleWere from "./middlewere/errorHandllingMiddlewre.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use(express.json());

app.use(route);

dbConnect();
app.use(errorHandlingMiddleWere);
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
