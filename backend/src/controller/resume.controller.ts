import { NextFunction, Response } from "express"
import  { upload } from "../config/CloudinaryConf";
import fs from "fs"
import path from "path"
import logger from "../utility/logger";
import { PrismaClient } from "@generated/prisma";
import { authRequest } from "../utility/authRequest";
import { readPdf } from "../services/readPdf";
import { getPdf } from "../services/getPdf";
import { pdfHistory } from "../services/getHistory";
import { UPLOAD_DIR } from "../config/CloudinaryConf";



const prisma = new PrismaClient()


export const UploadPdf = (req: authRequest, res: Response, next: NextFunction) => {
  upload.single("file-upload")(req, res, async (err: any) => {
    if (err) {
      logger.error("upload error:", err);
      return res.status(500).json({ msg: "Upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    try {
      logger.info("file uploaded");
      const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const newPdf = await prisma.pdf.create({
        data: {
          url,
          filename: req.file.filename,
          user: {
            connect: { id: req.user?.userId }
          }
        }
      });
      const all_pdfs = (await getPdf(req.user?.userId)).message

      res.json({newPdf, all_pdfs });

    } catch (dbErr) {
      logger.error("DB error in /upload:", dbErr);
      res.status(500).json({ error: (dbErr as Error).message });
    }
  });
};


export const processPdf = async (req: authRequest, res: Response) => {
  try {
    const {jobDescription} = req.body;
    const pdfId = parseInt(req.params.id, 10);
    if (isNaN(pdfId)) {
      return res.status(400).json({ error: "Invalid PDF ID" });
    }
    if (!jobDescription || typeof jobDescription !== "string") {
      return res.status(400).json({ error: "jobDescription is required" });
    }

    const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
    if (!pdfRecord) {
      return res.status(404).json({ error: "Pdf not found" });
    }
    if (pdfRecord.userId !== req.user?.userId) {
      return res.status(403).json({ error: "Not authorized to access this PDF" });
    }

    const storedName = pdfRecord.filename || pdfRecord.url.split("/uploads/")[1];
    const tempPath = path.join(UPLOAD_DIR, storedName || "");
    if (!storedName || !fs.existsSync(tempPath)) {
      return res.status(404).json({ error: "Stored PDF file not found" });
    }

    const ai_res = await readPdf(tempPath, jobDescription, pdfId);

   return res.status(200).json({ message: ai_res, });

  } catch (err: any) {
    logger.error("error in download pdf: ", err);
    return res.status(500).json({ error: err.message || err });
  }
};


export const deletePdf = async (req: authRequest, res: Response) => {
  try {
    const pdfId = parseInt(req.params.id, 10);
    if (isNaN(pdfId)) {
      return res.status(400).json({ error: "Invalid PDF ID" });
    }
    const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
    if (!pdfRecord) {
      return res.status(404).json({ error: "Pdf not found" });
    }
    if (pdfRecord.userId !== req.user?.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const storedName = pdfRecord.filename || pdfRecord.url.split("/uploads/")[1];
    if (storedName) {
      const filePath = path.join(UPLOAD_DIR, storedName);
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") logger.error(`Failed to delete file ${filePath}:`, err);
      });
    }
    await prisma.pdf.delete({ where: { id: pdfId } });
    return res.status(200).json({ message: "PDF deleted" });
  } catch (err: any) {
    logger.error(`error in deletePdf: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

export const allPdfs = async(req: authRequest, res:Response)=>{
  
  const pdfs = await getPdf(req.user?.userId)
  res.json({pdfs})
}

export const getHistory = async(req: authRequest, res:Response)=>{
  try{

    const pdfId = parseInt(req.params.id)
    if (isNaN(pdfId)) {
      return res.status(400).json({ error: "Invalid PDF ID" });
    }
    const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
    if (!pdfRecord) {
      return res.status(404).json({ error: "Pdf not found" });
    }
    if (pdfRecord.userId !== req.user?.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }
    const history = await pdfHistory(pdfId)
    if(history.status == true){
      const {data} = history
      return res.status(200).json({data})
    }
    return res.status(500).json({error: history.message})
  }catch(err:any){
    logger.error(`error in getHistory controller: ${err.message}`)
    return res.status(500).json({error:err.message})
  }
}