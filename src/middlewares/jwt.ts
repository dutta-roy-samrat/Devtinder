import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { setTokenInCookie } from "@utils/token";

import { SECRET_KEY } from "@constants/environment-variables";
import prisma from "@clients/prisma";
import { getUserByUniqueConstraint } from "@utils/user";

const validateRefreshToken = async ({
  refreshToken,
  res,
  req,
}: {
  refreshToken: string;
  res: Response;
  req: Request;
}) => {
  if (refreshToken) {
    try {
      jwt.verify(refreshToken, SECRET_KEY);
      const decoded = jwt.decode(refreshToken);
      if (decoded && typeof decoded !== "string" && "id" in decoded) {
        const { id } = decoded;
        setTokenInCookie({ res, userId: id });
        req.user = await getUserByUniqueConstraint({id});
      }
    } catch {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
  }
};

export const JWTAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;
  console.log(req.cookies);
  if (accessToken) {
    try {
      jwt.verify(accessToken, SECRET_KEY);
      const decoded = jwt.decode(accessToken);
      if (decoded && typeof decoded !== "string" && "id" in decoded) {
        const { id } = decoded;
        req.user = await getUserByUniqueConstraint({id});
      }
      return next();
    } catch (e) {
      validateRefreshToken({ res, refreshToken, req });
      return next();
    }
  }
  await validateRefreshToken({ refreshToken, res, req });
  return next();
};
