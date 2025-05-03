import { readFile } from "fs/promises";
import jwt from "jsonwebtoken";

import { transporter } from "@clients/mailer";

import {
  MY_EMAIL,
  RESET_PASSWORD_SECRET_KEY,
} from "@constants/environment-variables";
import { RESET_PASSWORD_ROUTE } from "@constants/routes";
import { ErrorWithStatus } from "@class/error";

const generateResetLink = (id: number) => {
  const token = jwt.sign({ id }, RESET_PASSWORD_SECRET_KEY, {
    expiresIn: "5m",
  });
  return `${RESET_PASSWORD_ROUTE}?token=${token}`;
};

export const resetPasswordMailer = async ({
  email,
  id,
}: {
  email: string;
  id: number;
}) => {
  try {
    const htmlFile = await readFile("./index.html", {
      encoding: "utf8",
      flag: "r",
    });
    const resetLink = generateResetLink(id);
    const htmlContent = htmlFile.replace("{{resetLink}}", resetLink);
    await transporter.sendMail({
      from: MY_EMAIL,
      to: email,
      subject: "Reset Your Password",
      html: htmlContent,
    });
  } catch (e) {
    throw new ErrorWithStatus("Something went Wrong", 500);
  }
};
