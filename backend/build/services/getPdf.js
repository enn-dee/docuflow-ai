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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPdf = void 0;
const prisma_1 = require("../generated/prisma");
const logger_1 = __importDefault(require("../utility/logger"));
const prisma = new prisma_1.PrismaClient();
const getPdf = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield prisma.pdf.findMany({
            where: { userId: id }
        });
        return { status: true, message: pdfs };
    }
    catch (err) {
        logger_1.default.error("error in getpdf: ", err);
        return { status: false };
    }
});
exports.getPdf = getPdf;
