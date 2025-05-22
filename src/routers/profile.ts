import { Router, Request, Response } from "express";

import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";

import { User } from "@generated/prisma";
import prisma from "@clients/prisma";
import { DEFAULT_OMITTED_FIELDS } from "@constants/omitted-fields";

const router = Router();

router.use(JWTAuthentication);

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id: userId } = req.query;
    const { id } = user as User;
    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId) || id,
      },
      // omit: DEFAULT_OMITTED_FIELDS,
    });
    res.status(200).json({ data: { ...user, profile: profile } });
  })
);

router.patch(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = user as User;
  })
);

export default router;
