import prisma from "@clients/prisma";
import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";
import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";
import { ErrorWithStatus } from "class/error";
import { Router, Request, NextFunction, Response } from "express";

const router = Router();

router.use(JWTAuthentication);

router.use(
  (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    if (err.status === 401) return next();
    next(err);
  }
);

const fieldsToBeOmiited = {
  ...DEFAULT_OMITTED_FIELDS,
  dateOfBirth: true,
};

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const { user } = req;
    const { limit = 10, page = 1 } = req.query;
    const skip = Number(limit) * (Number(page) - 1);
    const take = Number(limit);
    if (user) {
      const { id } = user;
      const usersInFeed = await prisma.user.findMany({
        skip,
        take,
        omit: fieldsToBeOmiited,
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

      return res.status(200).json({ data: usersInFeed });
    }
    const usersInFeed = await prisma.user.findMany({
      omit: fieldsToBeOmiited,
    });
    res.status(200).json({ data: usersInFeed });
  })
);

export default router;
