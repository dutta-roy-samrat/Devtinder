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
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
    },
  },
});

export default prisma;
