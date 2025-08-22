"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resume_controller_1 = require("../controller/resume.controller");
const authMiddleware_1 = require("../utility/authMiddleware");
const router = express_1.default.Router();
router.post("/upload", authMiddleware_1.authMiddleware, resume_controller_1.UploadPdf);
router.get("/pdf", authMiddleware_1.authMiddleware, resume_controller_1.allPdfs);
router.get("/pdf/:id", authMiddleware_1.authMiddleware, resume_controller_1.processPdf);
exports.default = router;
