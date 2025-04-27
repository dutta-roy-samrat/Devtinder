import { z } from "zod";
import validator from "validator";
import { UserSchema } from "./user";

const LoginSchema = UserSchema.pick({ email: true, password: true });

export { LoginSchema };
