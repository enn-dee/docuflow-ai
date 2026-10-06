"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const authMiddleware_1 = require("../utility/authMiddleware");
const router = express_1.default.Router();
router.post("/signup", user_controller_1.Signup);
router.post("/signin", user_controller_1.Signin);
router.get("/me", authMiddleware_1.authMiddleware, user_controller_1.me);
exports.default = router;
