import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

import { ErrorWithStatus } from "@class/error";

import { SECRET_KEY } from "@constants/environment-variables";

export const generateToken = (id: number) => {
  return jwt.sign({ id }, SECRET_KEY, { expiresIn: "15m" });
};

export const setTokenInCookie = ({
  res,
  userId,
}: {
  res: Response;
  userId: number;
}) => {
  const accessToken = generateToken(userId);

  res.setHeader("X-Access-Token", accessToken);
};

export const verifyAndDecodeToken = ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: string;
}): JwtPayload | null => {
  try {
    jwt.verify(token, secretKey);
    const decodedToken = jwt.decode(token) as JwtPayload;
    return decodedToken;
  } catch (error) {
    throw new ErrorWithStatus("Invalid Token", 404);
  }
};
