import { rateLimiter } from "@middlewares/rate-limiter/public-routes";
import { Request } from "express";

const authRoutesLimiter = rateLimiter({
  keyGenerator: (req: Request) => req.user?.email as string,
});

export { authRoutesLimiter };