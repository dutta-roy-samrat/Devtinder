import { Router, Response, Request } from "express";

import prisma from "@clients/prisma";
import { ConnectionStatus } from "@prisma/client";

import { JWTAuthentication } from "@middlewares/jwt";

import { ConnectionSchema } from "@schema-validations/connection-status-change";
import { asyncHandler } from "@utils/async-handler";
import { getUserByUniqueConstraint, getUserListResponse } from "@utils/user";
import { ErrorWithStatus } from "@class/error";

import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";
import { getCursorObject } from "@utils/user";
import omit from "lodash/omit";

const router = Router();

router.use(JWTAuthentication);

const fieldsToOmit = omit(DEFAULT_OMITTED_FIELDS, ["createdAt"]);

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.userId as number;
    const {
      success,
      data: statusData,
      error,
    } = await ConnectionSchema.pick({
      connectionStatus: true,
    }).safeParseAsync(req.query);

    if (!success) {
      throw new ErrorWithStatus(error.message, 400);
    }

    const { connectionStatus } = statusData;

    const filter = (() => {
      if (connectionStatus === ConnectionStatus.PENDING) {
        return {
          sentConnections: {
            some: {
              status: ConnectionStatus.PENDING,
              receiverId: id,
            },
          },
        };
      }
      return {
        OR: [
          {
            sentConnections: {
              some: {
                status: connectionStatus,
                receiverId: id,
              },
            },
          },
          {
            receivedConnections: {
              some: {
                status: connectionStatus,
                requesteeId: id,
              },
            },
          },
        ],
      };
    })();
    const { cursor, limit = 10 } = req.query;
    const cursorObj = getCursorObject({ cursor: cursor as string });
    const take = Number(limit);
    const data = await prisma.user.findMany({
      take,
      omit: fieldsToOmit,
      where: {
        NOT: {
          id,
        },
        AND: [filter],
      },
      skip: cursor ? 1 : 0,
      ...cursorObj,
      include: {
        profile: true,
      },
    });
    return res.status(200).json(
      getUserListResponse<keyof typeof fieldsToOmit>({
        users: data,
        cursor: cursor as string,
      })
    );
  })
);

router.patch(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { success, error, data } = await ConnectionSchema.omit({
      receiverId: true,
    }).safeParseAsync(req.body);
    const id = req.userId as number;

    if (!success) {
      throw new ErrorWithStatus(error.message, 400);
    }
    const { requesteeId, connectionStatus } = data;
    if (requesteeId === id || connectionStatus === ConnectionStatus.PENDING) {
      throw new ErrorWithStatus("Invalid Request", 400);
    }
    const connection = await prisma.connections.update({
      where: {
        requesteeId_receiverId: {
          requesteeId,
          receiverId: id,
        },
      },
      data: {
        status: ConnectionStatus[connectionStatus],
      },
    });
    if (!connection) {
      throw new ErrorWithStatus("Connection not found or not authorized", 404);
    }
    const requestee = await getUserByUniqueConstraint({
      id: requesteeId,
    });
    return res.status(200).json({
      message: `Accepted Request from ${requestee.firstName} ${requestee.lastName}`,
    });
  })
);

router.post(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { success, error, data } = await ConnectionSchema.omit({
      requesteeId: true,
    }).safeParseAsync(req.body);

    if (!success) {
      throw new ErrorWithStatus(error.message, 400);
    }
    const id = req.userId as number;
    const { receiverId, connectionStatus } = data;
    if (receiverId === id || connectionStatus === ConnectionStatus.ACCEPTED) {
      throw new ErrorWithStatus("Invalid Request", 400);
    }
    await prisma.connections.create({
      data: {
        requesteeId: id,
        receiverId,
        status: connectionStatus,
      },
    });
    // const receiver = await getUserByUniqueConstraint({
    //   id: receiverId,
    // });
    // if (connectionStatus === ConnectionStatus.PENDING) {
    //   connectionEmitter.emit("connection-request", {
    //     id: receiverId,
    //     message: `You received a new connection request from ${receiver.firstName} ${receiver.lastName}`,
    //   });
    // }
    return res.status(201).json({
      message:
        connectionStatus === ConnectionStatus.PENDING
          ? "Connection request sent!"
          : "",
    });
  })
);

export default router;
