"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const resume_route_1 = __importDefault(require("./routes/resume.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const PORT = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", resume_route_1.default);
app.use("/api", user_route_1.default);
app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});
