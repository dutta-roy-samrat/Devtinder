import { Router, Request, Response } from "express";

import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";

import { User } from "@generated/prisma";
import prisma from "@clients/prisma";

const router = Router();

router.use(JWTAuthentication);

router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = user as User;
    const profile = await prisma.profile.findUnique({
      where: {
        userId: id,
      },
    });
    res.status(200).json({ data: { ...user, profile: profile } });
  })
);

export default router;
