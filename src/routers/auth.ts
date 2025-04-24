import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { JWTAuthentication } from "@middlewares/jwt";
import { UserSchema } from "@schema-validations/user";
import { upload } from "@middlewares/file-storage";

import { IS_PRODUCTION } from "@constants/environment-variables";
import prisma from "@clients/prisma";
import { generateToken } from "@utils/token";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { success, data, error } = UserSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: "Invalid request", error: error });
  }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      },
    });
    const accessToken = generateToken(user.id);
    const refreshToken = generateToken(user.id);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});

router.post("/login", JWTAuthentication, (req: Request, res: Response) => {
  res.send("ok");
});

export default router;
