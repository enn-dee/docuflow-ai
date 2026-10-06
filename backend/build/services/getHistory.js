"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfHistory = pdfHistory;
const prisma_1 = require("@generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function pdfHistory(pdfId) {
    try {
        if (!pdfId) {
            return { status: false, message: "Missing pdfId" };
        }
        const history = await prisma.history.findMany({
            where: { hId: pdfId },
            orderBy: { AnalysedAt: "desc" }
        });
        return { status: true, data: history };
    }
    catch (error) {
        return { status: false, message: `Error fetching history: ${error.message}` };
    }
}
