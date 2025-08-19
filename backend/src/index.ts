import express from "express"
import cors from "cors"
import router from "./routes/resume.route";
import userRouter from "./routes/user.route";

const PORT = 3000
const app = express();

app.use(cors())
app.use(express.json())

app.use("/api", router)
app.use("/api",userRouter)

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})

