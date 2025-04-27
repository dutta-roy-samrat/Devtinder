import prisma from "@clients/prisma";
import { ErrorWithStatus } from "class/error";

type UserIdentifier =
  | { id: number; email?: never }
  | { email: string; id?: never };

export const getUserByUniqueConstraint = async (identifier: UserIdentifier) => {
  const user = await prisma.user.findUnique({
    where: identifier,
  });

  if (!user) {
    throw new ErrorWithStatus("User not found", 404);
  }

  return user;
};

export const getAgeOfUserFromDateOfBirth = (dateOfBirth: Date|string) =>
  new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
