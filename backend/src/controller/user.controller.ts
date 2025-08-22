import { Request, Response } from "express";
import bcrypt from "bcryptjs"
import logger from "../utility/logger";
import { PrismaClient } from "../generated/prisma";
import jwt from "jsonwebtoken";
import { jwt_secret } from "../config/process.env";


const prisma = new PrismaClient()

export const Signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { username, password: hashPassword },
    });

    return res.status(201).json({ msg: "User created", userId: user.id });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Username already taken" });
    }
    logger.error(`Error in /signup: ${err.message}`);
    return res.status(500).json({ error: "Server error" });
  }
};

export const Signin = async(req:Request, res:Response)=>{
    try{
        const {username, password} = req.body

        const existingUser = await prisma.user.findUnique({
            where:{username}
        })

        if(!existingUser){
            return res.status(400).json({error:"Invalid username"})
        }

        const isMatch:boolean = await bcrypt.compare(password,existingUser.password)

        if(!isMatch){
            return res.status(400).json({error:"Invalid password"})
        }

        const token = jwt.sign(
            {userId: existingUser.id, username:existingUser.username},
            jwt_secret || "jwt_secret", {expiresIn:'1h'}
        )

        return res.status(200).json({success:"LoggedIn", token})
    }catch(err:any){
          logger.error(`error occured in /signin: ${err}`)
        return res.status(500).json({error:err.message})
    }
}