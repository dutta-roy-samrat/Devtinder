import { Request, Response, NextFunction } from "express";
import { ErrorWithStatus } from "class/error";

const globalErrorHandler = (
  err: ErrorWithStatus | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Something went wrong !" });
};

export default globalErrorHandler;
