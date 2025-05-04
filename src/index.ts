  import express from "express";
  import bodyParser from "body-parser";
  import cookieParser from "cookie-parser";
  import { createServer } from "http";

  import prisma from "@clients/prisma";
  import authRouter from "@routers/auth";
  import feedRouter from "@routers/feed";
  import connectionRouter from "@routers/connections";
  import { rateLimiter } from "@middlewares/rate-limiter/public-routes";
  import globalErrorHandler from "@middlewares/global-error-handler";
  import { initializeSocket } from "@clients/socket";
  import profileRouter from "@routers/profile";
  const PORT = process.env.PORT || 8000;

  const app = express();
  const server = createServer(app);

  initializeSocket(server);

  async function startServer() {
    try {
      await prisma.$connect();
      console.log("Connected to DB successfully!");
      app.use(rateLimiter());
      app.use(bodyParser.json());
      app.use(cookieParser());
    app.use("/auth", authRouter);
    app.use("/feed", feedRouter);
    app.use("/connections", connectionRouter);
    app.use("/profile", profileRouter);
    app.use(globalErrorHandler);

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to the database", error);
    process.exit(1);
  }
}

startServer();
