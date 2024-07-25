import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";

import { fileURLToPath } from "url";
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);

const uploadDir = path.join(__dirname, "../public");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

export default upload;
