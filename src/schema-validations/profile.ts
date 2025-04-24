import { z } from "zod";
import validator from "validator";

const ProfileSchema = z.object({
  profileUrl: z.string().trim().url({ message: "Invalid profile URL" }),
  bio: z
    .string()
    .trim()
    .max(255, { message: "Bio must be less than 255 characters" })
    .refine((val) => validator.escape(val))
    .transform(val => val.trim())
});

export { ProfileSchema };
