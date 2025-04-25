import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { JWTAuthentication } from "@middlewares/jwt";
import { UserSchema } from "@schema-validations/user";

import prisma from "@clients/prisma";
import { setTokenInCookie } from "@utils/token";
import { LoginSchema } from "@schema-validations/login";
import { getUserByUniqueConstraint } from "@utils/user";

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
    setTokenInCookie({ res, userId: user.id });
    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong", error: e });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { success, error, data } = LoginSchema.safeParse(req.body);
  if (!success)
    return res.status(404).json({ message: "Invalid Request", error: error });

  try {
    const { email, password: passwordInput } = data;
    const user = await getUserByUniqueConstraint({ email });
    const { password } = user;
    const isPasswordValid = await bcrypt.compare(passwordInput, password);
    if (isPasswordValid) {
      setTokenInCookie({ res, userId: user.id });
      return res.status(200).json({ message: "User successfully logged in !" });
    }
    throw new Error();
  } catch {
    return res.status(401).json({ message: "Invalid Credentials" });
  }
});

export default router;
