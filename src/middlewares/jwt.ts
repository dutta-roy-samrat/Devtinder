import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const JWTAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies();
  console.log(accessToken, "kklop");
  //   const token;
  next();
};
