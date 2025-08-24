"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfHistory = pdfHistory;
const prisma_1 = require("@generated/prisma");
const prisma = new prisma_1.PrismaClient();
function pdfHistory(pdfId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!pdfId) {
                return { status: false, message: "Missing pdfId" };
            }
            const history = yield prisma.history.findMany({
                where: { hId: pdfId },
                orderBy: { AnalysedAt: "desc" }
            });
            return { status: true, data: history };
        }
        catch (error) {
            return { status: false, message: `Error fetching history: ${error.message}` };
        }
    });
}
