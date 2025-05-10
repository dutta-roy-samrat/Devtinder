import omit from "lodash/omit";
import { JwtPayload } from "jsonwebtoken";
import { Router, Request, NextFunction, Response } from "express";

import prisma from "@clients/prisma";
import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";
import { ErrorWithStatus } from "@class/error";

import { verifyAndDecodeToken } from "@utils/token";
import { FEED_CURSOR_SECRET_KEY } from "@constants/environment-variables";
import { getFeedResponse } from "@utils/feed";

import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";

const router = Router();

const fieldsToOmit = omit(DEFAULT_OMITTED_FIELDS, ["createdAt"]);

router.use(JWTAuthentication);

router.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    if (err.status === 401) return next();
    next(err);
  }
);

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { user } = req;
    const { cursor, limit = 10 } = req.query;
    const decodedToken = (() => {
      if (!cursor) return null;
      const decodedToken = verifyAndDecodeToken({
        secretKey: FEED_CURSOR_SECRET_KEY,
        token: cursor as string,
      });
      return decodedToken;
    })();

    const { id: cursorId, createdAt: cursorCreatedAt } = decodedToken || {};
    const cursorObj = decodedToken
      ? {
          cursor: {
            id: cursorId,
            createdAt: cursorCreatedAt,
          },
        }
      : {};
    const take = Number(limit);
    if (user) {
      const { id } = user;
      const usersInFeed = await prisma.user.findMany({
        take,
        omit: fieldsToOmit,
        ...cursorObj,
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
      });
      return res
        .status(200)
        .json(getFeedResponse<keyof typeof fieldsToOmit>(usersInFeed));
    }
    const usersInFeed = await prisma.user.findMany({
      ...cursorObj,
      take,
      omit: fieldsToOmit,
    });
    return res
      .status(200)
      .json(getFeedResponse<keyof typeof fieldsToOmit>(usersInFeed));
  })
);

export default router;
