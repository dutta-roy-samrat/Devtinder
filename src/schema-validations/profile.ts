import { z } from "zod";
import validator from "validator";

import { MulterFileSchema } from "@schema-validations/multer-file";

const ProfileSchema = z.object({
  profileImageCropInfo: z
    .object({
      crop: z.object({
        x: z.number().min(0),
        y: z.number().min(0),
      }),
      scale: z.number().min(0.1).max(5),
    })
    .optional(),
  originalProfileImageFile: z
    .array(MulterFileSchema)
    .max(1)
    .transform((arr) => arr?.[0])
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Image must be ≤5MB",
    })
    .refine((file) => !file || /^image\/(jpeg|png|webp)$/.test(file.mimetype), {
      message: "Only JPEG, PNG, or WebP images",
    })
    .nullable()
    .optional(),
  croppedProfileImageBlob: z
    .array(MulterFileSchema)
    .max(1)
    .transform((arr) => arr?.[0])
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Cropped image must be ≤5MB",
    })
    .nullable()
    .optional(),
  bio: z
    .string()
    .trim()
    .max(255, { message: "Bio must be ≤255 characters" })
    .optional()
    .transform((val) => validator.escape(val || "")),
});

const ProfileUploadSchema = ProfileSchema.extend({
  firstName: z
    .string()
    .trim()
    .min(1, "First name cannot be empty")
    .transform((val) => validator.escape(val))
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name cannot be empty")
    .transform((val) => validator.escape(val))
    .optional(),
});

export { ProfileSchema, ProfileUploadSchema };
