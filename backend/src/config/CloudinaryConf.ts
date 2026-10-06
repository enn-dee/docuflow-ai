import path from "path";
import fs from "fs";
import multer from "multer";

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const UPLOAD_DIR = path.resolve(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const base = file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${Date.now()}-${base}-${Math.round(Math.random() * 1e9)}.pdf`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});
