export const SECRET_KEY = process.env.SECRET_KEY as string;

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const SMTP_EMAIL = process.env.SMTP_EMAIL;
export const SMTP_PORT = process.env.SMTP_PORT;
export const SMTP_USER = process.env.SMTP_USER;
export const SMTP_API_KEY = process.env.SMTP_API_KEY;

export const MY_EMAIL = process.env.MY_EMAIL;

export const RESET_PASSWORD_SECRET_KEY = process.env
  .RESET_PASSWORD_SECRET_KEY as string;

export const BASE_FE_URL = process.env.BASE_FE_URL;

export const FEED_CURSOR_SECRET_KEY = process.env
  .FEED_CURSOR_SECRET_KEY as string;
