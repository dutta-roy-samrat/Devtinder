import { Http2Server } from "node:http2";
import { Server } from "socket.io";

let io: Server;

const initializeSocket = (server: Http2Server) => {
  io = new Server(server);
};

export { io, initializeSocket };
