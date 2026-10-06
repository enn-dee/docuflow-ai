"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPdf = void 0;
const fs_1 = __importDefault(require("fs"));
const GroqModel_1 = __importDefault(require("../utility/GroqModel"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const logger_1 = __importDefault(require("../utility/logger"));
const prisma_1 = require("@generated/prisma");
const prisma = new prisma_1.PrismaClient();
const readPdf = async (filePath, jobDescription, pdfIdf) => {
    try {
        // const filePath = path.join(__dirname,`../../tmp/${filename}`)
        if (!fs_1.default.existsSync(filePath)) {
            return { status: false, message: "File not found" };
        }
        if (!pdfIdf) {
            return { status: false, message: "Missing pdfId" };
        }
        const dataBuffer = fs_1.default.readFileSync(filePath);
        const data = await (0, pdf_parse_1.default)(dataBuffer).then(response => {
            return String(response.text);
        });
        const aiRes = await (0, GroqModel_1.default)(data, jobDescription);
        if (!aiRes) {
            return { status: false, message: "AI service returned no response" };
        }
        const result = JSON.parse(aiRes);
        logger_1.default.info(`ai res: ${JSON.stringify(result)}`);
        await prisma.history.create({
            data: {
                history: result,
                jobDescription,
                hId: pdfIdf
            }
        });
        return { status: true, message: result };
    }
    catch (error) {
        logger_1.default.error("error in read pdf func: ", error);
        return { status: false, message: `something went wrong: ${error}` };
    }
};
exports.readPdf = readPdf;
