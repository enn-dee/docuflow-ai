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
exports.allPdfs = exports.processPdf = exports.UploadPdf = void 0;
const CloudinaryConf_1 = require("../config/CloudinaryConf");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utility/logger"));
const prisma_1 = require("../generated/prisma");
const axios_1 = __importDefault(require("axios"));
const readPdf_1 = require("../services/readPdf");
const getPdf_1 = require("../services/getPdf");
const prisma = new prisma_1.PrismaClient();
const UploadPdf = (req, res, next) => {
    CloudinaryConf_1.upload.single("file-upload")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (err) {
            logger_1.default.error("upload error:", err);
            return res.status(500).json({ msg: "Upload failed", error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        try {
            logger_1.default.info("file uploaded");
            const url = req.file.path;
            const newPdf = yield prisma.pdf.create({
                data: {
                    url,
                    user: {
                        connect: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }
                    }
                }
            });
            const all_pdfs = (yield (0, getPdf_1.getPdf)((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId)).message;
            res.json({ newPdf, all_pdfs });
        }
        catch (dbErr) {
            logger_1.default.error("DB error in /upload:", dbErr);
            res.status(500).json({ error: dbErr.message });
        }
    }));
};
exports.UploadPdf = UploadPdf;
const processPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobDescription } = req.body;
        const pdfId = parseInt(req.params.id, 10);
        if (isNaN(pdfId)) {
            return res.status(400).json({ error: "Invalid PDF ID" });
        }
        const pdfRecord = yield prisma.pdf.findUnique({ where: { id: pdfId } });
        if (!pdfRecord) {
            return res.status(404).json({ error: "Pdf not found" });
        }
        const tempPath = path_1.default.join(__dirname, "../../tmp", `${pdfId}.pdf`);
        const tmpDir = path_1.default.dirname(tempPath);
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        const response = yield (0, axios_1.default)({
            url: pdfRecord.url,
            method: "GET",
            responseType: "stream",
        });
        const fileStream = fs_1.default.createWriteStream(tempPath);
        yield new Promise((resolve, reject) => {
            response.data.pipe(fileStream);
            response.data.on("error", reject);
            fileStream.on("finish", resolve);
        });
        const ai_res = yield (0, readPdf_1.readPdf)(tempPath, jobDescription);
        console.log(`ai response: ${ai_res}`);
        console.log(`PDF saved locally at ${tempPath}`);
        fs_1.default.unlink(tempPath, (err) => {
            if (err) {
                logger_1.default.error(`Failed to delete ${tempPath}:`, err);
            }
            else {
                logger_1.default.info(`Deleted ${tempPath} after processing`);
            }
        });
        return res.status(200).json({ message: ai_res, });
    }
    catch (err) {
        logger_1.default.error("error in download pdf: ", err);
        return res.status(500).json({ error: err.message || err });
    }
});
exports.processPdf = processPdf;
const allPdfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pdfs = yield (0, getPdf_1.getPdf)((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    res.json({ pdfs });
});
exports.allPdfs = allPdfs;
