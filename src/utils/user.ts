import prisma from "@clients/prisma";

import { User } from "@generated/prisma";
import { ErrorWithStatus } from "@class/error";

type UserIdentifier = (
  | { id: number; email?: never }
  | { email: string; id?: never }
) & { fieldsToBeOmitted?: { [key in keyof User]?: boolean } };

export const getUserByUniqueConstraint = async (identifier: UserIdentifier) => {
  const { fieldsToBeOmitted, ...rest } = identifier;
  const user = await prisma.user.findUnique({
    where: rest,
    omit: fieldsToBeOmitted,
  });

  if (!user) {
    throw new ErrorWithStatus("User not found", 404);
  }

  return user;
};

export const getAgeOfUserFromDateOfBirth = (dateOfBirth: Date | string) =>
  new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
