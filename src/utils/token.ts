import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

import { IS_PRODUCTION, SECRET_KEY } from "@constants/environment-variables";
import { ErrorWithStatus } from "class/error";

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
  const refreshToken = generateToken(userId);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    maxAge: 24 * 60 * 60 * 1000,
  });
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
