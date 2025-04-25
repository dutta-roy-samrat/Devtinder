import prisma from "@clients/prisma";

export const getUserByUniqueConstraint = async ({
  id,
  email = "",
}: {
  id?: number;
  email?: string;
}) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: id ? { id } : { email },
  });
  return user;
};
