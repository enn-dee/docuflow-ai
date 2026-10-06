"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.Signin = exports.Signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logger_1 = __importDefault(require("../utility/logger"));
const prisma_1 = require("@generated/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const process_env_1 = require("../config/process.env");
const prisma = new prisma_1.PrismaClient();
const Signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await prisma.user.create({
            data: { username, password: hashPassword },
        });
        return res.status(201).json({ msg: "User created", userId: user.id });
    }
    catch (err) {
        if (err.code === "P2002") {
            return res.status(400).json({ error: "Username already taken" });
        }
        logger_1.default.error(`Error in /signup: ${err.message}`);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.Signup = Signup;
const Signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid username" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id, username: existingUser.username }, process_env_1.jwt_secret || "jwt_secret", { expiresIn: '1h' });
        return res.status(200).json({ success: "LoggedIn", token });
    }
    catch (err) {
        logger_1.default.error(`error occured in /signin: ${err}`);
        return res.status(500).json({ error: err.message });
    }
};
exports.Signin = Signin;
const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user?.userId },
            select: { id: true, username: true, createdAt: true, _count: { select: { pdfs: true } } },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (err) {
        logger_1.default.error(`error in /me: ${err.message}`);
        return res.status(500).json({ error: "Server error" });
    }
};
exports.me = me;
