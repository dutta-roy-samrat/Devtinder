import { z } from "zod";
import validator from "validator";

const LoginSchema = z.object({
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
});

export { LoginSchema };
