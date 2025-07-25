import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { verifyAndDecodeToken } from "@utils/token";

import { ErrorWithStatus } from "class/error";

import { SECRET_KEY } from "@constants/environment-variables";
import { asyncHandler } from "@utils/async-handler";

export const JWTAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ErrorWithStatus("Unauthorized Access", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = verifyAndDecodeToken({
        secretKey: SECRET_KEY,
        token,
      });
      if (decodedToken && decodedToken.id) {
        req.userId = Number(decodedToken.id);
        return next();
      }
      throw new ErrorWithStatus("Unauthorized Access", 401);
    } catch {
      throw new ErrorWithStatus("Unauthorized Access", 401);
    }
  }
);
