import { NextFunction, Response } from "express";
import { authRequest } from "./authRequest";
import jwt from "jsonwebtoken"
import { jwt_secret } from "../config/process.env";

export const authMiddleware = async(req: authRequest, res: Response, next: NextFunction)=>{
        try{
            const authHeader = req.headers.authorization
            if(!authHeader || !authHeader.startsWith("Bearer ")){
                return res.status(401).json({ error: "No token provided" });
            }
            const authToken = authHeader.split(" ")[1]
           
        const decoded = jwt.verify(authToken, jwt_secret || "jwt_secret");
        req.user = decoded;
        next();

        }catch(err:any){
            return res.status(401).json({ error: "Invalid or expired token" });
        }
    }