import jwt from "jsonwebtoken";

import { SECRET_KEY } from "@constants/environment-variables";

export const generateToken = (id: number) => jwt.sign({ id }, SECRET_KEY);

