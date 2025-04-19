import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { JWTAuthentication } from "@middlewares/jwt";

const router = express.Router();

router.post("/login", JWTAuthentication, (req: Request, res: Response) => {
  res.send("ok");
});

export default router;