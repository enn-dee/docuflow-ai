import express, { NextFunction, Request, Response } from "express"
import cloudinary, { upload } from "../config/CloudinaryConf";
import pdf from "pdf-parse"
import fs from "node:fs"
import askGroq from "../utility/GroqModel";
import path from "node:path"
import logger from "../utility/logger";

export  const UploadPdf = (req:Request, res: Response, next:NextFunction) => {
  upload.single("file-upload")(req, res, (err: any) => {
    if (err) {
      logger.error("upload error: ", err);
      return res.status(500).json({ msg: "Upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    logger.info('file uploaded')
    res.json({ url: req.file.path });
  });
}


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


export const GetPdf = async (req: Request, res:Response)=>{
//  get pdf urls based on username 
  const data =await cloudinary.api.resources({    
    type:"upload",
    prefix:'ai_resume/',
    resource_type:"raw",
    max_results:10,

  })

  return res.status(200).json({entries:data.resources})
}