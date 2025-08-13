import express from "express"
import { GetPdf, ReadPdf, UploadPdf } from "../controller/resume";
import { authMiddleware } from "../utility/authMiddleware";
import { upload } from "../config/CloudinaryConf";
const router = express.Router();

router.post("/upload",authMiddleware,UploadPdf);

router.get("/api/read/:filename",ReadPdf)

router.get("/api/pdfs",GetPdf)

export default router