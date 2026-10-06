"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const resume_route_1 = __importDefault(require("./routes/resume.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const CloudinaryConf_1 = require("./config/CloudinaryConf");
const PORT = Number(process.env.PORT) || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(CloudinaryConf_1.UPLOAD_DIR));
const PUBLIC_DIR = path_1.default.join(__dirname, "../public");
app.use(express_1.default.static(PUBLIC_DIR));
app.use("/api", resume_route_1.default);
app.use("/api", user_route_1.default);
app.get("/health", (_req, res) => res.json({ status: "ok" }));
// SPA fallback: any non-API GET serves index.html
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
        return res.sendFile(path_1.default.join(PUBLIC_DIR, "index.html"));
    }
    next();
});
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
