import rateLimit, { Options } from "express-rate-limit";

const rateLimiter = (props?: Partial<Options>) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
    headers: true,
    ...props,
  });

export { rateLimiter };
