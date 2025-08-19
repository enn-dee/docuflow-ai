import dotenv from  "dotenv"
dotenv.config()

export const groq_Key = process.env.GROQ_API
export const cloudinary_key = process.env.CLOUDINARY_API
export const cloudinary_secret = process.env.CLOUDINARY_SECRET
export const cloudinary_name = process.env.CLOUDINARY_NAME
export const db_url = process.env.DB_URL
export const jwt_secret = process.env.JWT_SECRET