import { createTransport } from "nodemailer";

import {
  SMTP_API_KEY,
  SMTP_EMAIL,
  SMTP_PORT,
  SMTP_USER,
} from "@constants/environment-variables";

const smtpUrl = `smtps://${SMTP_USER}:${SMTP_API_KEY}@${SMTP_EMAIL}:${SMTP_PORT}`;

export const transporter = createTransport(smtpUrl);