import jwt from "jsonwebtoken";
import omit from "lodash/omit";

import { User } from "@generated/prisma";

import { FEED_CURSOR_SECRET_KEY } from "@constants/environment-variables";

type UserResponse<T extends keyof User> = Pick<User, "id" | "createdAt"> &
  Omit<User, T> & {
    age: number;
    fullName: string;
  };

export const getFeedResponse = <T extends keyof User>(
  users: UserResponse<T>[]
) => {
  if (users.length === 0) {
    return {
      data: [],
      nextCursor: null,
    };
  }
  const { id: nextCursorId, createdAt: nextCursorCreatedAt } =
    users[users.length - 1];
  const nextCursorToken = jwt.sign(
    { id: nextCursorId, createdAt: nextCursorCreatedAt },
    FEED_CURSOR_SECRET_KEY
  );
  const resData = users.map((user) => omit(user, ["createdAt"]));
  return {
    data: resData,
    nextCursor: nextCursorToken,
  };
};
