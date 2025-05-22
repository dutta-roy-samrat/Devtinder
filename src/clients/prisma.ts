import { PrismaClient } from "@generated/prisma";
import { getAgeOfUserFromDateOfBirth } from "@utils/user";

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      age: {
        needs: { dateOfBirth: true },
        compute(user) {
          return getAgeOfUserFromDateOfBirth(user.dateOfBirth);
        },
      },
    },
  },
});

export default prisma;
