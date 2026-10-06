import express from "express"
import { me, Signin, Signup } from "../controller/user.controller"
import { authMiddleware } from "../utility/authMiddleware"
const router = express.Router()

router.post("/signup",Signup)
router.post("/signin", Signin)
router.get("/me", authMiddleware, me)

export default router