
import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const userId = req.userId;
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + userId + fileExtension);
  },
});

const upload = multer({ storage });

export { upload };