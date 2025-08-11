import express, { Request, Response } from "express"
import cors from "cors"
import multer from "multer";
import path from "node:path"
import pdf from "pdf-parse"
import fs from "node:fs"

const PORT = 3000
const app = express();
const location = path.join(__dirname,"../public/uploads")

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, location)
    },
    filename: function(req, file,cb){
        const pref = Date.now()+'-'+Math.round(Math.random()* 1E4)
        cb(null, pref+"-"+file.originalname)
    }
})

const upload = multer({storage})

app.use(cors())


app.post("/api/upload",upload.single("file-upload"),async(req: Request, res: Response)=>{
    try{
    return res.status(200).json({msg:"Success" })
    }catch(error){
        console.log(`backend errro: `, error)
        return res.status(500).json({msg:"error in backend ",error })
    }
    
})

app.get("/api/read/:filename", async(req: Request, res: Response)=>{
    try{
        const filename = req.params.filename
        const filePath = path.join(__dirname,`../public/uploads/${filename}`)
        
        if(!fs.existsSync(filePath)){
            return res.status(404).json({msg: "file not found"})
        }

        const  dataBuffer = fs.readFileSync(filePath)
        
        const data = await pdf(dataBuffer)
        return res.status(200).json({msg:"Success", pdfText: data})
    }
    catch(error){
        console.log(`error in /api/read: `, error)
        return res.status(500).json({msg: "Internal server error: ", error})
    }
})

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})

