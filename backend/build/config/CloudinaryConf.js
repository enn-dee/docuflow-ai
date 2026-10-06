"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.UPLOAD_DIR = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const uploadDir = path_1.default.join(__dirname, "../../uploads");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
exports.UPLOAD_DIR = path_1.default.resolve(uploadDir);
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, exports.UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const base = file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");
        cb(null, `${Date.now()}-${base}-${Math.round(Math.random() * 1e9)}.pdf`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        }
        else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});
