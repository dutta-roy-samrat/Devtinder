import omit from "lodash/omit";
import { Router, Request, Response } from "express";

import prisma from "@clients/prisma";
import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";
import { getCursorObject, getUserListResponse } from "@utils/user";

import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";

const router = Router();

const fieldsToOmit = omit(DEFAULT_OMITTED_FIELDS, ["createdAt"]);

router.use(JWTAuthentication);

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { cursor, limit = 10 } = req.query;
    const cursorObj = getCursorObject({ cursor: cursor as string });
    const take = Number(limit);
    const id = req.userId as number;
    const usersInFeed = await prisma.user.findMany({
      take,
      omit: fieldsToOmit,
      ...cursorObj,
      skip: cursor ? 1 : 0,
      where: {
        id: {
          not: id,
        },
        AND: [
          {
            sentConnections: {
              none: {
                receiverId: id,
              },
            },
          },
          {
            receivedConnections: {
              none: {
                requesteeId: id,
              },
            },
          },
        ],
      },
      include: {
        profile: true,
      },
    });
    return res.status(200).json(
      getUserListResponse<keyof typeof fieldsToOmit>({
        users: usersInFeed,
        cursor: cursor as string,
      })
    );
  })
);

router.get(
  "/stream",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.userId as number;
    const { cursor, limit = 10 } = req.query;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const sendData = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });

    req.on("error", (error) => {
      console.error("SSE Error:", error);
      clearInterval(interval);
      res.end();
    });

    const take = Number(limit);

    const interval = setInterval(async () => {
      try {
        let cursorToken = cursor;
        const cursorObj = getCursorObject({ cursor: cursorToken as string });
        const usersInFeed = await prisma.user.findMany({
          take,
          omit: fieldsToOmit,
          ...cursorObj,
          skip: cursorToken ? 1 : 0,
          where: {
            id: {
              not: id,
            },
            AND: [
              {
                sentConnections: {
                  none: {
                    receiverId: id,
                  },
                },
              },
              {
                receivedConnections: {
                  none: {
                    requesteeId: id,
                  },
                },
              },
            ],
          },
          include: {
            profile: true,
          },
        });

        const { data, nextCursor } = getUserListResponse<keyof typeof fieldsToOmit>(
          {
            users: usersInFeed,
            cursor: cursorToken as string,
          }
        );
        sendData({ data, nextCursor });
        cursorToken = nextCursor;
      } catch (error) {
        console.error("Error sending SSE data:", error);
        clearInterval(interval);
        res.end();
      }
    }, 1000);
  })
);

export default router;
