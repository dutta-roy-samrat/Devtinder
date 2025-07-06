import { NextFunction, Request, Response } from "express";

import { verifyAndDecodeToken } from "@utils/token";

import { ErrorWithStatus } from "class/error";

import { SECRET_KEY } from "@constants/environment-variables";
import { asyncHandler } from "@utils/async-handler";

export const JWTAuthentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new ErrorWithStatus("Unauthorized Access", 401);
    }
    const token = authHeader.substring(7);
    if (!token) throw new ErrorWithStatus("Unauthorized Access", 401);

    try {
      const decodedToken = verifyAndDecodeToken({
        secretKey: SECRET_KEY,
        token,
      });
      if (decodedToken?.id) {
        const { id } = decodedToken;
        req.userId = Number(id);
        return next();
      }
      throw new ErrorWithStatus("Unauthorized Access", 401);
    } catch {
      throw new ErrorWithStatus("Unauthorized Access", 401);
    }
  }
);
