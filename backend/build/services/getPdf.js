"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
const prisma_1 = require("@generated/prisma");
const logger_1 = __importDefault(require("../utility/logger"));
const prisma = new prisma_1.PrismaClient();
const getPdf = async (id) => {
    try {
        const pdfs = await prisma.pdf.findMany({
            where: { userId: id },
            orderBy: { createdAt: "desc" },
            include: {
                History: {
                    orderBy: { AnalysedAt: "desc" },
                    take: 1
                }
            }
        });
        const withScore = pdfs.map((p) => ({
            id: p.id,
            url: p.url,
            userId: p.userId,
            createdAt: p.createdAt,
            latestScore: p.History[0]?.history?.ATS_Score ?? null,
        }));
        return { status: true, message: withScore };
    }
    catch (err) {
        logger_1.default.error("error in getpdf: ", err);
        return { status: false };
    }
};
exports.getPdf = getPdf;
