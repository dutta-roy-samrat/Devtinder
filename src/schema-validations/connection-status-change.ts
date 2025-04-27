import { ConnectionStatus } from "@generated/prisma";
import { z } from "zod";

const ConnectionSchema = z.object({
  requesteeId: z.number().nonnegative(),
  receiverId: z.number().nonnegative(),
  connectionStatus: z.nativeEnum(ConnectionStatus, {
    message: "Invalid Status",
  }),
});

export { ConnectionSchema };
