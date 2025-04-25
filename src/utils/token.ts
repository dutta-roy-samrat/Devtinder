import jwt from "jsonwebtoken";
import { Response } from "express";

import { IS_PRODUCTION, SECRET_KEY } from "@constants/environment-variables";

export const generateToken = (id: number) => jwt.sign({ id }, SECRET_KEY);

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
