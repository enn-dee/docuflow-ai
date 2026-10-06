import { PrismaClient } from "@generated/prisma";
import logger from "../utility/logger"
const prisma = new PrismaClient()
interface messageType{
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
    where:{userId:id},
    orderBy:{createdAt:"desc"},
    include:{
      History:{
        orderBy:{AnalysedAt:"desc"},
        take:1
      }
    }
  })
  const withScore = pdfs.map((p)=>({
    id: p.id,
    url: p.url,
    userId: p.userId,
    createdAt: p.createdAt,
    latestScore: (p.History[0]?.history as any)?.ATS_Score ?? null,
  }))
    return {status:true, message:withScore as any}
      }catch(err:any){

      logger.error("error in getpdf: ", err)
      return {status:false }

      }

    }
