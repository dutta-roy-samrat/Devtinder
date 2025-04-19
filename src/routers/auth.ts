import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { JWTAuthentication } from "@middlewares/jwt";
import { UserSchema } from "@schema-validations/user";
import { upload } from "@middlewares/file-storage";

const router = express.Router();


router.post("/register", (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, gender } = req.body;
    const { success, data, error } = UserSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid request", error: error })
    }
    console.log(data)
  }
  catch (e) {
    res.status(500).json({ message: "Something went wrong", error: e })
  }
});

router.post("/login", JWTAuthentication, (req: Request, res: Response) => {
  res.send("ok");
});

export default router;