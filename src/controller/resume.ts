import { NextFunction, Request, Response } from "express"
import  { upload } from "../config/CloudinaryConf";
import pdf from "pdf-parse"
import fs from "node:fs"
import askGroq from "../utility/GroqModel";
import path from "node:path"
import logger from "../utility/logger";
import { PrismaClient } from "../generated/prisma";
import { authRequest } from "../utility/authRequest";
import axios from "axios";



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

      res.json({ url, newPdf });
    } catch (dbErr) {
      logger.error("DB error in /upload:", dbErr);
      res.status(500).json({ error: (dbErr as Error).message });
    }
  });
};




export const ReadPdf = async(req: Request, res: Response)=>{
    try{
        
        const filename = req.params.filename
        const filePath = path.join(__dirname,`../public/uploads/${filename}`)
        
        if(!fs.existsSync(filePath)){
            return res.status(404).json({msg: "file not found"})
        }

        const  dataBuffer = fs.readFileSync(filePath)
        
        const data = await pdf(dataBuffer).then(response=>{
            return String(response.text)
        })

        const aiRes = await askGroq(data, 'need fullstack developer having 1 year experince')
        
        logger.info(`ai res: ${aiRes}`)
        
        return res.status(200).json({msg:"Success", improvments: aiRes})
    }
    catch(error){
        
        return res.status(500).json({msg: "Internal server error: ", error})
    }
}


export const GetPdf = async (req: authRequest, res:Response)=>{
try{

  const pdfs = await prisma.pdf.findMany({
    where:{userId:req.user?.id},
    omit:{userId:true}
  })
    return res.status(200).json({pdfs})
      }catch(err:any){

      logger.error("error in getpdf: ", err)
      return res.status(500).json({error:err})
      
      }

    }


export const downloadPdf = async (req: authRequest, res: Response) => {
  try {
    const pdfId = parseInt(req.params.id, 10);
    if (isNaN(pdfId)) {
      return res.status(400).json({ error: "Invalid PDF ID" });
    }

    const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
    if (!pdfRecord) {
      return res.status(404).json({ error: "Pdf not found" });
    }

    // full file path with filename
    const tempPath = path.join(__dirname, "../../tmp", `${pdfId}.pdf`);
    const tmpDir = path.dirname(tempPath);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const response: Axios.AxiosXHR<NodeJS.ReadableStream> = await axios({
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
// pdf processing

    console.log(`PDF saved locally at ${tempPath}`);


    fs.unlink(tempPath, (err) => {
  if (err) {
    console.error(`Failed to delete ${tempPath}:`, err);
  } else {
    console.log(`Deleted ${tempPath} after processing`);
  }
});

    res.json({ message: "PDF processed successfully" });

  } catch (err: any) {
    logger.error("error in download pdf: ", err);
    return res.status(500).json({ error: err.message || err });
  }
};
