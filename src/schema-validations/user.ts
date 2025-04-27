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
  dateOfBirth: z
    .string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, {
      message: "Date must be in yyyy/mm/dd format",
    })
    .refine(
      (val) => {
        const [year, month, day] = val.split("/").map(Number);
        const date = new Date(`${year}-${month}-${day}`);
        return (
          date instanceof Date &&
          !isNaN(date.getTime()) &&
          date.getFullYear() === year &&
          date.getMonth() + 1 === month &&
          date.getDate() === day
        );
      },
      {
        message: "Invalid date",
      }
    )
    .refine((val) => new Date(val.replace(/\//g, "-")) <= new Date(), {
      message: "Date of birth cannot be in the future",
    })
    .transform((val) =>
      new Date(val.replace(/\//g, "-")).toLocaleDateString("en-US")
    ),
  gender: z.nativeEnum(Gender, { message: "Invalid gender" }),
  profile: ProfileSchema.optional(),
  skills: z.array(SkillSchema).optional(),
});

export { UserSchema };
