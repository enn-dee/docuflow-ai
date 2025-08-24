import { PrismaClient } from "@generated/prisma";
import logger from "../utility/logger"
const prisma = new PrismaClient()
type messageType={
url:string,
id:number
}
interface returnResponse{
    status:boolean,
    message?: messageType[]
}
export const getPdf = async (id:number):Promise<returnResponse>=>{
try{
  
  const pdfs = await prisma.pdf.findMany({
    where:{userId:id}
  })
    return {status:true, message:pdfs}
      }catch(err:any){

      logger.error("error in getpdf: ", err)
      return {status:false }
      
      }

    }