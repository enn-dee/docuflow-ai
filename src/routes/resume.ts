import express from "express"
import { downloadPdf, GetPdf, ReadPdf, UploadPdf } from "../controller/resume";
import { authMiddleware } from "../utility/authMiddleware";
import { upload } from "../config/CloudinaryConf";
const router = express.Router();

router.post("/upload",authMiddleware,UploadPdf);

router.get("/read/:filename",ReadPdf)

router.get("/pdfs",authMiddleware,GetPdf)

router.get("/pdf/:id", authMiddleware, downloadPdf)

export default router