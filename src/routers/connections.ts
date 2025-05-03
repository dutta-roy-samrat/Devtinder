import { Router, Response, Request } from "express";

import prisma from "@clients/prisma";
import { ConnectionStatus, User } from "@generated/prisma";

import { JWTAuthentication } from "@middlewares/jwt";

import { ConnectionSchema } from "@schema-validations/connection-status-change";
import { asyncHandler } from "@utils/async-handler";
import { getUserByUniqueConstraint } from "@utils/user";
import { ErrorWithStatus } from "@class/error";

import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";

const router = Router();

router.use(JWTAuthentication);

const fieldsToBeOmiited = {
  ...DEFAULT_OMITTED_FIELDS,
  dateOfBirth: true,
};

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.user as User;

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
    const { limit = 10, page = 1 } = req.query;
    const skip = Number(limit) * (Number(page) - 1);
    const take = Number(limit);
    const data = await prisma.user.findMany({
      skip,
      take,
      omit: fieldsToBeOmiited,
      where: {
        NOT: {
          id,
        },
        AND: [filter],
      },
    });
    return res.status(200).json({ data });
  })
);

router.patch(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { success, error, data } = await ConnectionSchema.omit({
      receiverId: true,
    }).safeParseAsync(req.body);
    const { id } = req.user as User;

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
    return res
      .status(200)
      .json({ message: `Accepted Request from ${requestee.fullName}` });
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
    const { id } = req.user as User;
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
    return res.status(201).json({
      message:
        connectionStatus === ConnectionStatus.PENDING
          ? "Connection request sent!"
          : "",
    });
  })
);

export default router;
