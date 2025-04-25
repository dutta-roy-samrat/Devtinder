import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import prisma from "@clients/prisma";
import authRouter from "@routers/auth";
import { rateLimiter } from "@middlewares/rate-limiter/public-routes";

const PORT = process.env.PORT || 8000;

const app = express();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to DB successfully!");
    app.use(rateLimiter());
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use("/auth", authRouter);
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:8000");
    });
  } catch (error) {
    console.error("Could not connect to the database", error);
    process.exit(1);
  }
}

startServer();
