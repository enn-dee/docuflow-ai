"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwt_secret = exports.db_url = exports.cloudinary_name = exports.cloudinary_secret = exports.cloudinary_key = exports.groq_Key = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.groq_Key = process.env.GROQ_API;
exports.cloudinary_key = process.env.CLOUDINARY_API;
exports.cloudinary_secret = process.env.CLOUDINARY_SECRET;
exports.cloudinary_name = process.env.CLOUDINARY_NAME;
exports.db_url = process.env.DB_URL;
exports.jwt_secret = process.env.JWT_SECRET;
