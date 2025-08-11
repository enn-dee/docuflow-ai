import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer";
import path from "node:path"
import pdf from "pdf-parse"
import fs from "node:fs"
import {CloudinaryStorage} from "multer-storage-cloudinary"
import askGroq from "./utility/GroqModel";
import cloudinary from "./utility/CloudinaryConf";

const PORT = 3000
const app = express();
const location = path.join(__dirname,"../public/uploads")

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, location)
//     },
//     filename: function(req, file,cb){
//         const pref = Date.now()+'-'+Math.round(Math.random()* 1E4)
//         cb(null, pref+"-"+file.originalname)
//     }
// })
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "ai_resume",
      resource_type: "raw",
      format: "pdf",
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed") as any, false);
    }
  },
});

// const upload = multer({storage:storage})

app.use(cors())


// app.post("/api/upload", upload.single("file-upload"), (req, res) => {
//   console.log("File object:", req.file); 
//   if (!req.file) {
//     return res.status(400).json({ msg: "No file uploaded" });
//   }
//   res.json({ url: req.file.path }); 
// });

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
        console.log("hiiii")
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

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})

