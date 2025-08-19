import {v2 as cloudinary} from "cloudinary"
import { cloudinary_key, cloudinary_name, cloudinary_secret } from "./process.env"
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name:cloudinary_name,
    api_key: cloudinary_key,
    api_secret: cloudinary_secret
})

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "ai_resume",
      resource_type: "raw",
      format: "pdf",
      public_id: Date.now()+"-"+file.originalname.split(".")[0]+"-"+Math.round(Math.random()*1E9),
    };
  },
});

export const upload = multer({
  storage,
  limits:{fileSize:10*1024*1024},
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed") as any, false);
    }
  },
});


// local storage testing..

// export const upload = multer ({
//   dest:__dirname+"/uploads/"
// })
export default cloudinary