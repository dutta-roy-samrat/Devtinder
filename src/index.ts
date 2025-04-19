import express from "express";
import bodyParser from "body-parser";

import prisma from "@clients/prisma";
import authRouter from "@routers/auth";

const app = express();

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to DB successfully!");
    app.use(bodyParser.json());
    app.use("/auth", authRouter);
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Could not connect to the database", error);
    process.exit(1);
  }
}

startServer();
