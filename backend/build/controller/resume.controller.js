"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = exports.allPdfs = exports.deletePdf = exports.processPdf = exports.UploadPdf = void 0;
const CloudinaryConf_1 = require("../config/CloudinaryConf");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utility/logger"));
const prisma_1 = require("@generated/prisma");
const readPdf_1 = require("../services/readPdf");
const getPdf_1 = require("../services/getPdf");
const getHistory_1 = require("../services/getHistory");
const CloudinaryConf_2 = require("../config/CloudinaryConf");
const prisma = new prisma_1.PrismaClient();
const UploadPdf = (req, res, next) => {
    CloudinaryConf_1.upload.single("file-upload")(req, res, async (err) => {
        if (err) {
            logger_1.default.error("upload error:", err);
            return res.status(500).json({ msg: "Upload failed", error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        try {
            logger_1.default.info("file uploaded");
            const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
            const newPdf = await prisma.pdf.create({
                data: {
                    url,
                    filename: req.file.filename,
                    user: {
                        connect: { id: req.user?.userId }
                    }
                }
            });
            const all_pdfs = (await (0, getPdf_1.getPdf)(req.user?.userId)).message;
            res.json({ newPdf, all_pdfs });
        }
        catch (dbErr) {
            logger_1.default.error("DB error in /upload:", dbErr);
            res.status(500).json({ error: dbErr.message });
        }
    });
};
exports.UploadPdf = UploadPdf;
const processPdf = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const pdfId = parseInt(req.params.id, 10);
        if (isNaN(pdfId)) {
            return res.status(400).json({ error: "Invalid PDF ID" });
        }
        if (!jobDescription || typeof jobDescription !== "string") {
            return res.status(400).json({ error: "jobDescription is required" });
        }
        const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
        if (!pdfRecord) {
            return res.status(404).json({ error: "Pdf not found" });
        }
        if (pdfRecord.userId !== req.user?.userId) {
            return res.status(403).json({ error: "Not authorized to access this PDF" });
        }
        const storedName = pdfRecord.filename || pdfRecord.url.split("/uploads/")[1];
        const tempPath = path_1.default.join(CloudinaryConf_2.UPLOAD_DIR, storedName || "");
        if (!storedName || !fs_1.default.existsSync(tempPath)) {
            return res.status(404).json({ error: "Stored PDF file not found" });
        }
        const ai_res = await (0, readPdf_1.readPdf)(tempPath, jobDescription, pdfId);
        return res.status(200).json({ message: ai_res, });
    }
    catch (err) {
        logger_1.default.error("error in download pdf: ", err);
        return res.status(500).json({ error: err.message || err });
    }
};
exports.processPdf = processPdf;
const deletePdf = async (req, res) => {
    try {
        const pdfId = parseInt(req.params.id, 10);
        if (isNaN(pdfId)) {
            return res.status(400).json({ error: "Invalid PDF ID" });
        }
        const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
        if (!pdfRecord) {
            return res.status(404).json({ error: "Pdf not found" });
        }
        if (pdfRecord.userId !== req.user?.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }
        const storedName = pdfRecord.filename || pdfRecord.url.split("/uploads/")[1];
        if (storedName) {
            const filePath = path_1.default.join(CloudinaryConf_2.UPLOAD_DIR, storedName);
            fs_1.default.unlink(filePath, (err) => {
                if (err && err.code !== "ENOENT")
                    logger_1.default.error(`Failed to delete file ${filePath}:`, err);
            });
        }
        await prisma.pdf.delete({ where: { id: pdfId } });
        return res.status(200).json({ message: "PDF deleted" });
    }
    catch (err) {
        logger_1.default.error(`error in deletePdf: ${err.message}`);
        return res.status(500).json({ error: err.message });
    }
};
exports.deletePdf = deletePdf;
const allPdfs = async (req, res) => {
    const pdfs = await (0, getPdf_1.getPdf)(req.user?.userId);
    res.json({ pdfs });
};
exports.allPdfs = allPdfs;
const getHistory = async (req, res) => {
    try {
        const pdfId = parseInt(req.params.id);
        if (isNaN(pdfId)) {
            return res.status(400).json({ error: "Invalid PDF ID" });
        }
        const pdfRecord = await prisma.pdf.findUnique({ where: { id: pdfId } });
        if (!pdfRecord) {
            return res.status(404).json({ error: "Pdf not found" });
        }
        if (pdfRecord.userId !== req.user?.userId) {
            return res.status(403).json({ error: "Not authorized" });
        }
        const history = await (0, getHistory_1.pdfHistory)(pdfId);
        if (history.status == true) {
            const { data } = history;
            return res.status(200).json({ data });
        }
        return res.status(500).json({ error: history.message });
    }
    catch (err) {
        logger_1.default.error(`error in getHistory controller: ${err.message}`);
        return res.status(500).json({ error: err.message });
    }
};
exports.getHistory = getHistory;
