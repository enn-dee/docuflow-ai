import path from "node:path"
import fs from "node:fs"
import askGroq from "../utility/GroqModel"
import pdf from "pdf-parse"
import logger from "../utility/logger"

interface returnResponse{
status:boolean,
message: string
}

export const readPdf = async(filePath:string, jobDescription: string):Promise<returnResponse>=>{
    try{
        
        // const filePath = path.join(__dirname,`../../tmp/${filename}`)
        
        if(!fs.existsSync(filePath)){
           return {status:false, message:"File not found"}
        }

        const  dataBuffer = fs.readFileSync(filePath)
        
        const data = await pdf(dataBuffer).then(response=>{
            return String(response.text)
        })

        const aiRes = await askGroq(data,jobDescription )
        
        logger.info(`ai res: ${aiRes}`)
        
        return {status:true, message:aiRes}
    }
    catch(error: any){
        logger.error("error in read pdf func: ", error)
        return {status:false, message:`something went wrong: ${error}`}
    }
}