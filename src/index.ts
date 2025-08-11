import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer";
import path from "node:path"
import pdf from "pdf-parse"
import fs from "node:fs"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import askGroq from "./utility/GroqModel";
import cloudinary, { upload } from "./config/CloudinaryConf";

const PORT = 3000
const app = express();
const location = path.join(__dirname,"../public/uploads")


app.use(cors())



app.post("/api/upload", (req, res, next) => {
  upload.single("file-upload")(req, res, (err: any) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ msg: "Upload failed", error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    res.json({ url: req.file.path });
  });
});



app.get("/api/read/:filename", async(req: Request, res: Response)=>{
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

        console.log(`ai res: ${aiRes}`)
        return res.status(200).json({msg:"Success", improvments: aiRes})
    }
    catch(error){
        console.log(`error in /api/read: `, error)
        return res.status(500).json({msg: "Internal server error: ", error})
    }
})

app.get("/api/pdfs",async (req, res)=>{
 
  const data =await cloudinary.api.resources({max_results:10}).then(pdf=>pdf)
  return res.status(200).json({entries:data})
})
app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})

