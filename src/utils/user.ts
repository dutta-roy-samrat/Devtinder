import jwt from "jsonwebtoken";
import omit from "lodash/omit";

import prisma from "@clients/prisma";

import { User } from "@prisma/client";
import { ErrorWithStatus } from "@class/error";

import { verifyAndDecodeToken } from "@utils/token";

import { USER_CURSOR_SECRET_KEY } from "@constants/environment-variables";

type UserResponse<T extends keyof User> = Pick<User, "id" | "createdAt"> &
  Omit<User, T> & {
    age: number;
  };

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

const getNextUserListCursorToken = <T extends keyof User>({
  users,
}: {
  users: UserResponse<T>[];
}) => {
  const { id: nextCursorId, createdAt: nextCursorCreatedAt } =
    users[users.length - 1];
  const nextCursorToken = jwt.sign(
    { id: nextCursorId, createdAt: nextCursorCreatedAt },
    USER_CURSOR_SECRET_KEY
  );
  return nextCursorToken;
};

export const getUserListResponse = <T extends keyof User>({
  users,
  cursor,
}: {
  users: UserResponse<T>[];
  cursor: string;
}) => {
  if (users.length === 0) {
    return {
      data: [],
      nextCursor: cursor,
    };
  }
  const resData = users.map((user) => omit(user, ["createdAt"]));
  return {
    data: resData,
    nextCursor: getNextUserListCursorToken({ users }),
  };
};

export const getCursorObject = ({ cursor }: { cursor: string }) => {
  if (!cursor) return {};
  const decodedToken = verifyAndDecodeToken({
    secretKey: USER_CURSOR_SECRET_KEY,
    token: cursor as string,
  });

  const { id: cursorId, createdAt: cursorCreatedAt } = decodedToken || {};
  return decodedToken
    ? {
        cursor: {
          createdAt: cursorCreatedAt,
          id: cursorId,
        },
      }
    : {};
};
