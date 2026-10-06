import fs from "fs"
import askGroq from "../utility/GroqModel"
import pdf from "pdf-parse"
import logger from "../utility/logger"
import { PrismaClient } from "@generated/prisma"


interface returnResponse{
status:boolean,
message: any,
}
const prisma = new PrismaClient()

export const readPdf = async(filePath:string, jobDescription: string, pdfIdf: number):Promise<returnResponse>=>{
    try{
        
        // const filePath = path.join(__dirname,`../../tmp/${filename}`)
        
        if(!fs.existsSync(filePath)){
           return {status:false, message:"File not found"}
        }

        if(!pdfIdf){
            return {status:false, message:"Missing pdfId"}
        }
        const  dataBuffer = fs.readFileSync(filePath)
        
        const data = await pdf(dataBuffer).then(response=>{
            return String(response.text)
        })

        const aiRes = await askGroq(data,jobDescription )
        if (!aiRes) {
            return {status:false, message:"AI service returned no response"}
        }
        const result = JSON.parse(aiRes)
        logger.info(`ai res: ${JSON.stringify(result)}`)

        await prisma.history.create({
            data:{
                history:result,
                jobDescription,
                hId:pdfIdf
            }
        })
        return {status:true, message:result}
    }
    catch(error: any){
        logger.error("error in read pdf func: ", error)
        return {status:false, message:`something went wrong: ${error}`}
    }
}