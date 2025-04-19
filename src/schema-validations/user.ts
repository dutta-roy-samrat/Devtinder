import { z } from "zod";
import validator from "validator";

import { Gender } from "@generated/prisma";
import { ProfileSchema } from "@schema-validations/profile";
import { SkillSchema } from "@schema-validations/skill";

const UserSchema = z.object({
    firstName: z
        .string().trim()
        .min(1, { message: "First name is required" })
        .max(50, { message: "First name must be less than 50 characters" }),
    lastName: z
        .string().trim()
        .min(1, { message: "Last name is required" })
        .max(50, { message: "Last name must be less than 50 characters" }),
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: z
        .string().trim()
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
        ),
    dateOfBirth: z.coerce.date(),
    gender: z.nativeEnum(Gender, { message: "Invalid gender" }),
    profile: ProfileSchema.optional(),
    skills: z.array(SkillSchema).optional(),
});

export { UserSchema };
