import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

interface ReturnFormat {
  status: boolean;
  data?: any;
  message?: string;
}

export async function pdfHistory(pdfId: number): Promise<ReturnFormat> {
  try {
    if (!pdfId) {
      return { status: false, message: "Missing pdfId" };
    }

    const history = await prisma.history.findMany({
      where: { hId: pdfId },
      orderBy: { AnalysedAt: "desc" } 
    });

    return { status: true, data: history };
  } catch (error: any) {
    return { status: false, message: `Error fetching history: ${error.message}` };
  }
}
