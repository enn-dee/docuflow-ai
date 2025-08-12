import express from "express"
import { GetPdf, ReadPdf, UploadPdf } from "../controller/resume";
const router = express.Router();

router.post("/upload",UploadPdf);


router.get("/api/read/:filename",ReadPdf)

router.get("/api/pdfs",GetPdf)

export default router