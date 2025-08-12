import express from "express"
import cors from "cors"
import router from "./routes/resume";
import logger from "./utility/logger";

const PORT = 3000
const app = express();

app.use(cors())

app.use("/api", router)

app.listen(PORT, ()=>{
    console.log(`Server listening at port ${PORT}`)
})

