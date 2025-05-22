import { z } from "zod";
import validator from "validator";

import { Gender } from "@generated/prisma";
import { ProfileSchema } from "@schema-validations/profile";
import { SkillSchema } from "@schema-validations/skill";

const UserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must be less than 50 characters" })
    .refine((val) => validator.escape(val))
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .trim()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must be less than 50 characters" })
    .refine((val) => validator.escape(val))
    .transform((val) => val.trim()),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .transform((val) => val.trim()),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(
      (val) =>
        validator.isStrongPassword(val, {
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
      {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      }
    )
    .transform((val) => val.trim()),
  dateOfBirth: z.preprocess(
    (val) => {
      if (typeof val === "string" && val.trim() === "") return undefined;
      return val;
    },
    z.coerce.date({ invalid_type_error: "Invalid date" }).refine(
      (val) => {
        const today = new Date();
        const birthDate = new Date(val);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          return age - 1 >= 18;
        }

        return age >= 18;
      },
      {
        message: "Must be at least 18 years old",
      }
    )
  ),
  gender: z.nativeEnum(Gender, { message: "Invalid gender" }),
  profile: ProfileSchema.optional(),
  skills: z.array(SkillSchema).optional(),
});

export { UserSchema };
