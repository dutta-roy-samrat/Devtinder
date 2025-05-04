import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

const initializeSocket = (server: HttpServer) => {
  io = new Server(server);
};

export { io, initializeSocket };
