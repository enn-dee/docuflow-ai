import express from "express"
import cors from "cors"
import path from "path"
import router from "./routes/resume.route";
import userRouter from "./routes/user.route";
import { UPLOAD_DIR } from "./config/CloudinaryConf";

const PORT = Number(process.env.PORT) || 3000
const app = express();

app.use(cors())
app.use(express.json())

app.use("/uploads", express.static(UPLOAD_DIR))

const PUBLIC_DIR = path.join(__dirname, "../public")
app.use(express.static(PUBLIC_DIR))

app.use("/api", router)
app.use("/api", userRouter)

app.get("/health", (_req, res) => res.json({ status: "ok" }))

// SPA fallback: any non-API GET serves index.html
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.startsWith("/uploads")) {
        return res.sendFile(path.join(PUBLIC_DIR, "index.html"))
    }
    next()
})

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})
