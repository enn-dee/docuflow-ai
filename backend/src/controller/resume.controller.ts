import { NextFunction, Request, Response } from "express"
import  { upload } from "../config/CloudinaryConf";
import fs from "node:fs"
import path from "node:path"
import logger from "../utility/logger";
import { PrismaClient } from "../generated/prisma";
import { authRequest } from "../utility/authRequest";
import axios from "axios";
import { readPdf } from "../services/readPdf";
import { getPdf } from "../services/getPdf";




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
      const url = req.file.path;

      const newPdf = await prisma.pdf.create({
        data: {
          url,
          user: {
            connect: { id: req.user?.userId }
          }
        }
      });
      console.log('current user: ', req.user?.id)
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

    const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
    if (!pdfRecord) {
      return res.status(404).json({ error: "Pdf not found" });
    }

    const tempPath = path.join(__dirname, "../../tmp", `${pdfId}.pdf`);
    const tmpDir = path.dirname(tempPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const response: any = await axios({
      url: pdfRecord.url,
      method: "GET",
      responseType: "stream",
    });

    const fileStream = fs.createWriteStream(tempPath);
    await new Promise<void>((resolve, reject) => {
      (response.data as NodeJS.ReadableStream).pipe(fileStream);
      response.data.on("error", reject);
      fileStream.on("finish", resolve);
    });

   const ai_res= await readPdf(tempPath, jobDescription)
   console.log(`ai response: ${ai_res}`) 
   console.log(`PDF saved locally at ${tempPath}`);

    fs.unlink(tempPath, (err) => {
  if (err) {
    logger.error(`Failed to delete ${tempPath}:`, err);
  } else {
    logger.info(`Deleted ${tempPath} after processing`);
  }
});

   return res.status(200).json({ message: ai_res, });

  } catch (err: any) {
    logger.error("error in download pdf: ", err);
    return res.status(500).json({ error: err.message || err });
  }
};


export const allPdfs = async(req: authRequest, res:Response)=>{
  
  const pdfs = await getPdf(req.user?.userId)
  res.json({pdfs})

}