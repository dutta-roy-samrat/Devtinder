import { z } from "zod";
import validator from "validator";

const SkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Skill name is required" })
    .max(100, { message: "Skill name must be under 100 characters" })
    .refine((val) => validator.escape(val))
    .transform(val => val.trim())
});

export { SkillSchema };
