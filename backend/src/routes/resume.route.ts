import express from "express"
import {   allPdfs, deletePdf, getHistory, processPdf, UploadPdf } from "../controller/resume.controller";
import { authMiddleware } from "../utility/authMiddleware";
const router = express.Router();

router.post("/upload",authMiddleware,UploadPdf);
router.get("/pdf", authMiddleware, allPdfs)
router.post("/pdf/:id", authMiddleware, processPdf)
router.delete("/pdf/:id", authMiddleware, deletePdf)

// pdf history
router.get("/history/:id", authMiddleware, getHistory)

export default router