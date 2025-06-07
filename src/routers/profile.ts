import multer from "multer";
import { Router, Request, Response, NextFunction } from "express";
import fs from "fs";

import { JWTAuthentication } from "@middlewares/jwt";
import { asyncHandler } from "@utils/async-handler";

import { User } from "@generated/prisma";
import prisma from "@clients/prisma";
import { ProfileUploadSchema } from "@schema-validations/profile";
import { ErrorWithStatus } from "@class/error";
import { getImageUrlFromPath } from "@utils/uploads";

const router = Router();

const profileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const type = file.fieldname.includes("original") ? "original" : "cropped";
      const userPath = `uploads/profiles/${req.userId}/${type}/`;
      fs.mkdirSync(userPath, { recursive: true });
      cb(null, userPath);
    },
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname
        .replace(/[^a-z0-9.]/gi, "_")
        .toLowerCase();
      cb(null, sanitizedName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const reqBodyModifier = (req: Request, files: any, next: NextFunction) => {
  try {
    req.body = {
      ...req.body,
      ...(req.body.profileImageCropInfo && {
        profileImageCropInfo: JSON.parse(req.body.profileImageCropInfo),
      }),
      ...req.files,
    };
    next();
  } catch (error) {
    next(new ErrorWithStatus("Invalid request data", 400));
  }
};

router.use(JWTAuthentication);

router.get(
  "",
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.userId as number;
    const { id: userId } = req.query;
    const data = await prisma.user.findUnique({
      where: {
        id: Number(userId) || id,
      },
      include: {
        profile: true,
        skills: true,
      },
    });
    res.status(200).json(data);
  })
);

router.patch(
  "",
  profileUpload.fields([
    { name: "originalProfileImageFile", maxCount: 1 },
    { name: "croppedProfileImageBlob", maxCount: 1 },
  ]),
  reqBodyModifier,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.userId as number;
    const { success, data, error } = await ProfileUploadSchema.safeParseAsync(
      req.body
    );
    if (!success) {
      throw new ErrorWithStatus("Invalid profile data", 400);
    }
    const [updatedUser, updatedProfile] = await prisma.$transaction([
      prisma.user.update({
        where: { id },
        data: {
          ...(data.firstName && { firstName: data.firstName }),
          ...(data.lastName && { lastName: data.lastName }),
        },
      }),

      prisma.profile.upsert({
        where: { userId: id },
        update: {
          ...(data.bio && { bio: data.bio }),
          ...(data.originalProfileImageFile && {
            originalProfileImageUrl: getImageUrlFromPath(
              data.originalProfileImageFile.path
            ),
          }),
          ...(data.croppedProfileImageBlob && {
            croppedProfileImageUrl: getImageUrlFromPath(
              data.croppedProfileImageBlob.path
            ),
          }),
          ...(data.profileImageCropInfo && {
            profileImageCropInfo: data.profileImageCropInfo,
          }),
        },
        create: {
          userId: id,
          bio: data?.bio,
          originalProfileImageUrl: getImageUrlFromPath(
            data.originalProfileImageFile?.path || ""
          ),
          croppedProfileImageUrl: getImageUrlFromPath(
            data.croppedProfileImageBlob?.path || ""
          ),
          profileImageCropInfo: data?.profileImageCropInfo,
        },
      }),
    ]);

    res.status(200).json({
      message: "Profile updated successfully",
      data: {
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        },
        profile: updatedProfile,
      },
    });
  })
);

export default router;
