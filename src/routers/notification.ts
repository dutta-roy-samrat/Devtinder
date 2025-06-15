// import { User } from "@prisma/client";
// import { JWTAuthentication } from "@middlewares/jwt";
// import connectionEmitter from "event-emitters/connection";
// import { Router } from "express";
// const router = Router();

// router.use(JWTAuthentication);

// router.get("/stream", (req, res) => {
//   const { user } = req;
//   const { id } = user as User;
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");
//   res.flushHeaders();

//   const sendData = (data: any) => {
//     res.write(`data: ${JSON.stringify(data)}\n\n`);
//   };

//   connectionEmitter.on("connection-request", (data) => {
//     console.log(data, "data");
//     if (data.id === id) {
//       sendData(data.message);
//     }
//   });

//   res.on("close", () => {
//     res.end();
//   });

//   res.on("error", (error) => {
//     console.error("SSE Error:", error);
//     res.end();
//   });
// });

// export default router;
