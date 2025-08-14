import express from "express"
import {   allPdfs, processPdf, UploadPdf } from "../controller/resume";
import { authMiddleware } from "../utility/authMiddleware";
const router = express.Router();

router.post("/upload",authMiddleware,UploadPdf);
router.get("/pdf", authMiddleware, allPdfs)
router.get("/pdf/:id", authMiddleware, processPdf)

export default router