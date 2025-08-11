import {v2 as cloudinary} from "cloudinary"
import { cloudinary_key, cloudinary_name, cloudinary_secret } from "./process.env"

cloudinary.config({
    cloud_name:cloudinary_name,
    api_key: cloudinary_key,
    api_secret: cloudinary_secret
})

export default cloudinary